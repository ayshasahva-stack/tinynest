import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getMyCartThunk } from "../../features/cart/cartThunk";
import { createOrderThunk } from "../../features/checkout/checkoutThunk";
import { getMyAddressesThunk } from "../../features/addresses/addressThunk";
import { selectAddresses } from "../../features/addresses/addressSelectors";
import {
  createRazorpayCheckoutSessionThunk,
  verifyRazorpayCheckoutSessionThunk,
  createPaymentThunk,
} from "../../features/payments/paymentThunk";
import {
  selectPaymentLoading,
  selectPaymentError,
} from "../../features/payments/paymentSelectors";
import {
  selectCartItems,
  selectCartLoading,
  selectCartError,
} from "../../features/cart/cartSelectors";
import {
  selectCheckoutLoading,
  selectCheckoutError,
} from "../../features/checkout/checkoutSelectors";
import { applyCouponThunk } from "../../features/coupons/couponThunk";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Return the best available image and title for either a product or a kit.
const getCartItemDetails = (item) => {
  if (item.itemType === "kit") {
    return {
      title: item.kit?.name || item.title || "Baby essentials kit",
      image: item.kit?.image || item.image || "",
      originalPrice: Number(item.kit?.price ?? item.price ?? 0),
      unitPrice: Number(
        item.pricing?.unitPrice ??
          (item.kit
            ? item.kit.price - (item.kit.price * (item.kit.discount || 0)) / 100
            : item.price ?? 0)
      ),
      subtitle: "Essentials kit",
    };
  }

  const product = item.product;
  return {
    title: product?.title || item.title || "Baby essential",
    image: product?.images?.[0] || item.image || "",
    originalPrice: Number(product?.price ?? item.price ?? 0),
    unitPrice: Number(item.pricing?.unitPrice ?? product?.price ?? item.price ?? 0),
    subtitle: product?.brand || "Baby essential",
  };
};

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [razorpayLoaded, setRazorpayLoaded] = useState(
    () => Boolean(window.Razorpay)
  );
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [validationError, setValidationError] = useState("");

  const addresses = useSelector(selectAddresses);
  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const checkoutLoading = useSelector(selectCheckoutLoading);
  const checkoutError = useSelector(selectCheckoutError);
  const paymentLoading = useSelector(selectPaymentLoading);
  const paymentError = useSelector(selectPaymentError);

  useEffect(() => {
    dispatch(getMyCartThunk());
    dispatch(getMyAddressesThunk());
  }, [dispatch]);

  // Select the default address when available, otherwise the first saved address.
  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddressId("");
      return;
    }

    setSelectedAddressId((currentId) => {
      // Keep the user's selection if it still exists in the refreshed address list.
      if (currentId && addresses.some((address) => address._id === currentId)) {
        return currentId;
      }
      return addresses.find((address) => address.isDefault)?._id || addresses[0]._id;
    });
  }, [addresses]);

  const selectedAddress = addresses.find(
    (address) => address._id === selectedAddressId
  );

  // Use backend-calculated unit prices where available for consistent totals.
  const subtotal = cartItems.reduce((total, item) => {
    const details = getCartItemDetails(item);
    if (!details.title || (!item.product && !item.kit && !item.title)) return total;
    return total + details.unitPrice * Number(item.quantity || 0);
  }, 0);

  // Keep this rule aligned with the current backend checkout rule.
  const shippingFee = subtotal >= 1000 ? 0 : 50;
  const totalAmount = subtotal + shippingFee;

  // Coupon preview values are calculated and validated by the backend.
  const displaySubtotal = appliedCoupon ? appliedCoupon.subtotal : subtotal;
  const displayDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const displayShippingFee = appliedCoupon ? appliedCoupon.shippingFee : shippingFee;
  const displayTotal = appliedCoupon ? appliedCoupon.totalAmount : totalAmount;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setValidationError("");

    try {
      const result = await dispatch(applyCouponThunk(code)).unwrap();
      setAppliedCoupon(result);
      setCouponCode(result.code);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(
        typeof error === "string"
          ? error
          : "Unable to apply this coupon. Please try again."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!cartItems.length) {
      setValidationError("Your cart is empty.");
      return;
    }

    if (!selectedAddress) {
      setValidationError("Please select a delivery address.");
      return;
    }

    const checkoutData = {
      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine: selectedAddress.addressLine,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
      },
      ...(appliedCoupon && { couponCode: appliedCoupon.code }),
    };

    try {
      // COD still creates an order immediately using the existing flow.
      if (paymentMethod === "cod") {
        const orderResult = await dispatch(
          createOrderThunk(checkoutData)
        ).unwrap();

        const orderId = orderResult.data?._id;
        if (!orderId) throw new Error("The created order ID was not returned.");

        await dispatch(createPaymentThunk({
          orderId,
          paymentMethod: "cod",
        })).unwrap();

        await dispatch(getMyCartThunk());
        navigate("/orders");
        return;
      }

      // Online payment does NOT create an Order document at this stage.
      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error("Razorpay Checkout has not loaded. Please refresh and try again.");
      }

      const sessionResult = await dispatch(
        createRazorpayCheckoutSessionThunk(checkoutData)
      ).unwrap();

      const checkoutSession = sessionResult.data;
      if (!checkoutSession?.razorpayOrderId) {
        throw new Error("Razorpay did not return a checkout session.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: checkoutSession.amount,
        currency: checkoutSession.currency || "INR",
        name: "TinyNest",
        description: "Baby essentials order",
        order_id: checkoutSession.razorpayOrderId,
        handler: async (response) => {
          try {
            // The backend verifies the signature and captured status first.
            // Only then does it create the real order and clear the cart.
            await dispatch(
              verifyRazorpayCheckoutSessionThunk({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            await dispatch(getMyCartThunk());
            navigate("/orders");
          } catch (error) {
            console.error("Razorpay checkout verification needs attention:", error);
            setValidationError(
              typeof error === "string"
                ? error
                : "We could not confirm the payment yet. Do not pay again until the payment status is checked."
            );
          }
        },
        modal: {
          ondismiss: () => {
            // No order exists yet, so the cart remains untouched.
            setValidationError(
              "Payment was not completed. Your cart is unchanged, and no order was placed."
            );
          },
        },
        theme: { color: "#436558" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        // A failed attempt does not create an order or clear the cart.
        setValidationError(
          response.error?.description ||
          "Payment failed. Your cart is unchanged, and no order was placed."
        );
      });
      razorpay.open();
    } catch (error) {
      console.error("Checkout failed:", error);
      setValidationError(
        typeof error === "string"
          ? error
          : error.message || "Unable to complete checkout."
      );
    }
  };

  // Load Razorpay's hosted checkout script once this page mounts.
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      setRazorpayLoaded(false);
      setValidationError(
        "Unable to load Razorpay. Check your internet connection and refresh."
      );
    };
    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  if (cartLoading && cartItems.length === 0) return <Loading />;

  if (!cartLoading && cartItems.length === 0) {
    return (
      <main className="checkout-reference min-h-screen bg-[#f7f9ff] px-4 py-12 dark:bg-[#171b1e]">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-[#20272b] sm:p-12">
          <EmptyState
            title="Your cart is empty"
            message="Add some products before proceeding to checkout."
          />
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-[#436558] px-6 py-3 font-semibold text-white transition hover:bg-[#355247]"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const itemCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  return (
    <main className="checkout-reference min-h-screen bg-[#f7f9ff] px-4 py-8 text-[#181c20] dark:bg-[#171b1e] dark:text-gray-100 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb keeps checkout connected to the shopping flow. */}
        <nav className="mb-5 flex items-center gap-2 text-sm text-[#626b67] dark:text-gray-400">
          <Link to="/" className="transition hover:text-[#436558]">Home</Link>
          <span>/</span>
          <Link to="/cart" className="transition hover:text-[#436558]">Shopping Bag</Link>
          <span>/</span>
          <span className="font-medium text-[#436558] dark:text-[#a9cfbe]">Checkout</span>
        </nav>

        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#436558]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#436558] dark:text-[#a9cfbe]">
              <span aria-hidden="true">✓</span> Secure checkout
            </span>
            <h1 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
              Express Nursery Delivery
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#414845] dark:text-gray-400 sm:text-base">
              Confirm your delivery details and review your TinyNest order.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#414845] dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm dark:bg-[#20272b]">
              <span className="text-[#436558]" aria-hidden="true">♧</span> Thoughtful essentials
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm dark:bg-[#20272b]">
              <span className="text-[#436558]" aria-hidden="true">⌑</span> Secure payment
            </span>
          </div>
        </header>

        {(cartError || checkoutError || validationError) && (
          <div className="mb-6 space-y-3">
            {cartError && <ErrorMessage message={cartError} />}
            {checkoutError && <ErrorMessage message={checkoutError} />}
            {validationError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                {validationError}
              </div>
            )}
          </div>
        )}

        {/* The three-step strip is a visual guide; all steps remain on this page. */}
        <div className="mb-7 rounded-xl border border-[#e5e8ed] bg-white px-4 py-5 shadow-sm dark:border-gray-800 dark:bg-[#20272b] sm:px-7">
          <div className="grid grid-cols-3 gap-2">
            {[
              { number: "1", label: "Delivery", icon: "⌖" },
              { number: "2", label: "Order review", icon: "▤" },
              { number: "3", label: "Payment", icon: "⌑" },
            ].map((step, index) => (
              <div key={step.number} className="relative flex items-center gap-2 sm:gap-3">
                {index < 2 && (
                  <span className="absolute left-9 right-[-0.5rem] top-4 hidden h-px bg-gray-200 dark:bg-gray-700 sm:block" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#436558] text-sm font-bold text-white">
                  {step.number}
                </span>
                <span className="relative z-10 bg-white pr-1 text-xs font-semibold text-[#181c20] dark:bg-[#20272b] dark:text-gray-200 sm:text-sm">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid items-start gap-7 lg:grid-cols-12">
          {/* Left column: saved address and payment choices. */}
          <div className="space-y-6 lg:col-span-8">
            <section className="rounded-xl border border-[#e5e8ed] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#20272b] sm:p-7">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#436558]/10 font-semibold text-[#436558] dark:text-[#a9cfbe]">1</span>
                  <div>
                    <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">Delivery address</h2>
                    <p className="mt-1 text-sm text-[#626b67] dark:text-gray-400">
                      Where should we send your order?
                    </p>
                  </div>
                </div>
                <Link
                  to="/addresses"
                  className="inline-flex items-center gap-1 self-start text-sm font-semibold text-[#436558] hover:underline dark:text-[#a9cfbe] sm:self-center"
                >
                  Manage addresses <span aria-hidden="true">↗</span>
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-[#f1f4f9] p-6 text-center dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-sm text-[#414845] dark:text-gray-300">
                    You don't have any saved addresses yet.
                  </p>
                  <Link
                    to="/addresses"
                    className="mt-4 inline-flex rounded-xl bg-[#436558] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#355247]"
                  >
                    Add delivery address
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {addresses.map((address) => {
                    const selected = selectedAddressId === address._id;
                    return (
                      <label
                        key={address._id}
                        className={`relative flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                          selected
                            ? "border-[#436558] bg-[#edf3ef] ring-1 ring-[#436558]/20 dark:border-[#78998b] dark:bg-[#263a32]"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-[#20272b] dark:hover:border-gray-500"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={address._id}
                          checked={selected}
                          onChange={(event) => {
                            setSelectedAddressId(event.target.value);
                            setValidationError("");
                          }}
                          className="mt-1 h-4 w-4 accent-[#436558]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[#181c20] dark:text-white">{address.fullName}</span>
                            {address.isDefault && (
                              <span className="rounded-full bg-[#436558]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#436558] dark:text-[#a9cfbe]">
                                Default
                              </span>
                            )}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-[#414845] dark:text-gray-300">
                            {address.addressLine}
                            <br />
                            {address.city}, {address.state} – {address.postalCode}
                            <br />
                            {address.country}
                          </span>
                          <span className="mt-2 block text-sm text-[#626b67] dark:text-gray-400">
                            Phone: {address.phone}
                          </span>
                          {selected && (
                            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#436558] dark:text-[#a9cfbe]">
                              <span aria-hidden="true">✓</span> Selected for delivery
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-[#e5e8ed] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#20272b] sm:p-7">
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#436558]/10 font-semibold text-[#436558] dark:text-[#a9cfbe]">2</span>
                <div>
                  <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">Review your bag</h2>
                  <p className="mt-1 text-sm text-[#626b67] dark:text-gray-400">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your order
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cartItems.map((item, index) => {
                  const details = getCartItemDetails(item);
                  const quantity = Number(item.quantity || 0);
                  const lineTotal = details.unitPrice * quantity;
                  const hasDiscount = details.unitPrice < details.originalPrice;

                  return (
                    <div key={item._id || `${item.itemType}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f0f1ed] dark:bg-gray-800 sm:h-24 sm:w-24">
                        {details.image ? (
                          <img src={details.image} alt={details.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">TinyNest</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-5 text-[#181c20] dark:text-white">{details.title}</p>
                        <p className="mt-1 text-xs text-[#626b67] dark:text-gray-400">{details.subtitle}</p>
                        <p className="mt-2 text-sm text-[#626b67] dark:text-gray-400">Qty: {quantity}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-[#181c20] dark:text-white">{money(lineTotal)}</p>
                        {hasDiscount && (
                          <p className="mt-1 text-xs text-gray-400 line-through">
                            {money(details.originalPrice * quantity)}
                          </p>
                        )}
                        {hasDiscount && (
                          <p className="mt-1 text-xs font-medium text-[#436558] dark:text-[#a9cfbe]">
                            Save {money((details.originalPrice - details.unitPrice) * quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 rounded-xl bg-[#f5f6f2] p-4 text-sm text-[#414845] dark:bg-gray-800 dark:text-gray-300">
                <span className="font-semibold text-[#436558] dark:text-[#a9cfbe]">A little care in every order.</span>{" "}
                Review your items and quantities before placing your order.
              </div>
            </section>

            <section className="rounded-xl border border-[#e5e8ed] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#20272b] sm:p-7">
              <div className="mb-5 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#436558]/10 font-semibold text-[#436558] dark:text-[#a9cfbe]">3</span>
                <div>
                  <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">Payment method</h2>
                  <p className="mt-1 text-sm text-[#626b67] dark:text-gray-400">
                    Choose how you'd like to pay.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "online" ? "border-[#436558] bg-[#edf3ef] dark:border-[#78998b] dark:bg-[#263a32]" : "border-gray-200 hover:border-gray-300 dark:border-gray-700"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mt-1 h-4 w-4 accent-[#436558]"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold text-[#181c20] dark:text-white">Pay online with Razorpay</span>
                    <span className="mt-1 block text-sm leading-5 text-[#626b67] dark:text-gray-400">
                      Complete payment using the secure Razorpay checkout.
                    </span>
                  </span>
                  <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-[#436558] dark:bg-[#20272b] dark:text-[#a9cfbe]">Online</span>
                </label>

                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${paymentMethod === "cod" ? "border-[#436558] bg-[#edf3ef] dark:border-[#78998b] dark:bg-[#263a32]" : "border-gray-200 hover:border-gray-300 dark:border-gray-700"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mt-1 h-4 w-4 accent-[#436558]"
                  />
                  <span className="flex-1">
                    <span className="block font-semibold text-[#181c20] dark:text-white">Cash on Delivery</span>
                    <span className="mt-1 block text-sm leading-5 text-[#626b67] dark:text-gray-400">
                      Pay when your order is delivered.
                    </span>
                  </span>
                  <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-[#626b67] dark:bg-[#20272b] dark:text-gray-300">COD</span>
                </label>
              </div>
              {paymentError && (
                <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{paymentError}</p>
              )}
            </section>
          </div>

          {/* Right column: coupon and live order totals. */}
          <aside className="lg:sticky lg:top-6 lg:col-span-4">
            <div className="rounded-xl border border-[#e5e8ed] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#20272b] sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">Order summary</h2>
                <span className="rounded-full bg-[#f0f1ed] px-3 py-1 text-xs font-semibold text-[#414845] dark:bg-gray-800 dark:text-gray-300">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-[#181c20] dark:text-white">Have a coupon?</h3>
                {appliedCoupon ? (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#436558] dark:text-[#a9cfbe]">
                        ✓ {appliedCoupon.code} applied
                      </p>
                      <p className="mt-1 text-xs text-[#626b67] dark:text-gray-400">
                        You saved {money(appliedCoupon.discount)}
                      </p>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="text-sm font-semibold text-red-600 hover:underline dark:text-red-400">
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(event) => {
                          setCouponCode(event.target.value);
                          setCouponError("");
                        }}
                        placeholder="Enter code"
                        disabled={couponLoading}
                        aria-label="Coupon code"
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm uppercase text-[#181c20] outline-none transition placeholder:normal-case focus:border-[#436558] focus:ring-2 focus:ring-[#436558]/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="rounded-lg bg-[#436558] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#355247] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {couponLoading ? "Applying…" : "Apply"}
                      </button>
                    </div>
                    {couponError && <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{couponError}</p>}
                  </>
                )}
              </div>

              <div className="mt-6 space-y-3 border-b border-[#e5e8ed] pb-5 text-sm dark:border-gray-800">
                <div className="flex justify-between gap-4">
                  <span className="text-[#626b67] dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-[#181c20] dark:text-white">{money(displaySubtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[#436558] dark:text-[#a9cfbe]">Coupon discount</span>
                    <span className="font-medium text-[#436558] dark:text-[#a9cfbe]">−{money(displayDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-[#626b67] dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-[#181c20] dark:text-white">
                    {Number(displayShippingFee) === 0 ? "Free" : money(displayShippingFee)}
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 py-5">
                <div>
                  <p className="font-semibold text-[#181c20] dark:text-white">Total to pay</p>
                  <p className="mt-1 text-xs text-[#626b67] dark:text-gray-400">Including applicable discounts</p>
                </div>
                <p className="font-serif text-3xl text-[#436558] dark:text-[#a9cfbe]">{money(displayTotal)}</p>
              </div>

              {!selectedAddress && addresses.length > 0 && (
                <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">
                  Select a delivery address to continue.
                </p>
              )}

              <button
                type="submit"
                disabled={checkoutLoading || paymentLoading || !selectedAddress || !cartItems.length}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#436558] px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-[#355247] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutLoading || paymentLoading
                  ? "Processing your order…"
                  : paymentMethod === "cod"
                    ? "Place order"
                    : "Continue to secure payment"}
                {!checkoutLoading && !paymentLoading && <span aria-hidden="true">→</span>}
              </button>

              <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-5 text-[#626b67] dark:text-gray-400">
                <span className="mt-0.5 text-[#436558]" aria-hidden="true">⌑</span>
                Your payment is handled through the selected payment method.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#e5e8ed] pt-5 dark:border-gray-800">
                <div className="rounded-xl bg-[#f5f6f2] p-3 text-center dark:bg-gray-800">
                  <span className="block text-lg text-[#436558] dark:text-[#a9cfbe]" aria-hidden="true">⌑</span>
                  <span className="mt-1 block text-xs font-semibold text-[#181c20] dark:text-gray-200">Secure checkout</span>
                </div>
                <div className="rounded-xl bg-[#f5f6f2] p-3 text-center dark:bg-gray-800">
                  <span className="block text-lg text-[#436558] dark:text-[#a9cfbe]" aria-hidden="true">♡</span>
                  <span className="mt-1 block text-xs font-semibold text-[#181c20] dark:text-gray-200">Made for little ones</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
