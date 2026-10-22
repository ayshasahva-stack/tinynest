import mongoose from "mongoose";

// A checkout session is a payment attempt, not a customer order.
// Abandoned attempts therefore never appear in My Orders.
const checkoutSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 }, // Amount in rupees
    currency: { type: String, default: "INR", required: true },
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    couponCode: { type: String, default: null },
    cartFingerprint: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "abandoned", "review"],
      default: "pending",
      index: true,
    },
    razorpayPaymentId: { type: String, default: null },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true }
);

const CheckoutSession = mongoose.model("CheckoutSession", checkoutSessionSchema);
export default CheckoutSession;
