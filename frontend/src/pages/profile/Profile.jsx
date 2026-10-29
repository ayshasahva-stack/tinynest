
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AccountSidebar from "../../components/AccounSidebar";

function Profile() {
  // Get the currently logged-in user from Redux.
const user = useSelector((state) => state.auth.user);
  // Use a fallback when some user details are unavailable.
  const fullName =
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "TinyNest Customer";

  const email = user?.email || "No email available";
  const phone = user?.phone || "Not added yet";

  return (
    <main className="min-h-screen bg-[#f7f9ff] px-4 py-8 text-gray-800 transition-colors dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#436558] dark:text-emerald-300">
            My Account
          </p>

          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
            Welcome back, {fullName}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Manage your personal information, orders, saved addresses, and
            wishlist in one place.
          </p>
        </div>

        {/* Sidebar and profile content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
          {/* Shared sidebar used by Orders and Saved Addresses too */}
          <AccountSidebar user={user} />

          {/* Main profile content */}
          <section className="min-w-0 space-y-6">
            {/* Profile overview card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* User initials avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#dce7e2] font-serif text-2xl font-semibold text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                  {fullName
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "TN"}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-2xl font-semibold">
                    {fullName}
                  </h2>

                  <p className="mt-1 break-words text-sm text-gray-500 dark:text-gray-400">
                    {email}
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Account shortcuts */}
            <div>
              <h2 className="mb-4 font-serif text-2xl font-semibold">
                Your Account
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Orders shortcut */}
                <Link
                  to="/orders"
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dce7e2] text-xl text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                    <span aria-hidden="true">📦</span>
                  </div>

                  <h3 className="font-semibold">My Orders</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    View your orders and check their status.
                  </p>

                  <span className="mt-4 inline-block text-sm font-medium text-[#436558] group-hover:underline dark:text-emerald-300">
                    View orders →
                  </span>
                </Link>

                {/* Saved addresses shortcut */}
                <Link
                  to="/addresses"
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dce7e2] text-xl text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                    <span aria-hidden="true">📍</span>
                  </div>

                  <h3 className="font-semibold">Saved Addresses</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Manage your delivery addresses.
                  </p>

                  <span className="mt-4 inline-block text-sm font-medium text-[#436558] group-hover:underline dark:text-emerald-300">
                    Manage addresses →
                  </span>
                </Link>

                {/* Wishlist shortcut */}
                <Link
                  to="/wishlist"
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dce7e2] text-xl text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                    <span aria-hidden="true">♡</span>
                  </div>

                  <h3 className="font-semibold">Saved Wishlist</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Find the baby essentials you saved.
                  </p>

                  <span className="mt-4 inline-block text-sm font-medium text-[#436558] group-hover:underline dark:text-emerald-300">
                    View wishlist →
                  </span>
                </Link>

                {/* Products shortcut */}
                <Link
                  to="/products"
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dce7e2] text-xl text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                    <span aria-hidden="true">🧸</span>
                  </div>

                  <h3 className="font-semibold">Explore Products</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Discover thoughtful essentials for your little one.
                  </p>

                  <span className="mt-4 inline-block text-sm font-medium text-[#436558] group-hover:underline dark:text-emerald-300">
                    Shop now →
                  </span>
                </Link>
              </div>
            </div>

            {/* Customer support card */}
            <div className="rounded-3xl bg-[#dce7e2] p-6 dark:bg-gray-900 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-wider text-[#436558] dark:text-emerald-300">
                We're here to help
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Need a little help?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                If you have questions about an order or need help with your
                account, our team is here to help.
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex rounded-full bg-[#436558] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#345247] dark:bg-emerald-800 dark:hover:bg-emerald-700"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Profile;
