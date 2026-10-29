
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getAllUsersThunk,
    blockUserThunk,
    unblockUserThunk,
    deleteUserThunk,
} from "../../features/users/userThunk";

import {
    selectUsers,
    selectUsersLoading,
    selectUsersError,
    selectUserActionLoading,
    selectUserActionError,
    selectUserActionSuccess,
} from "../../features/users/userSelectors";

import { clearUserFeedback } from "../../features/users/userSlice";

function AdminUsers() {
    const dispatch = useDispatch();

    // Read customer information and request states from Redux.
    const users = useSelector(selectUsers);
    const loading = useSelector(selectUsersLoading);
    const error = useSelector(selectUsersError);
    const actionLoading = useSelector(selectUserActionLoading);
    const actionError = useSelector(selectUserActionError);
    const actionSuccess = useSelector(selectUserActionSuccess);

    // Keep the search input local to this page.
    const [search, setSearch] = useState("");

    // Fetch customers when the page first opens.
    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    // Search locally without making a new API request per keystroke.
    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return users;

        return users.filter((user) =>
            user.email?.toLowerCase().includes(query) ||
            user.phone?.toLowerCase().includes(query)
        );
    }, [users, search]);

    // Block or unblock a customer after confirmation.
    const handleToggleBlock = async (user) => {
        const action = user.isBlocked ? "unblock" : "block";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${user.email}?`
        );

        if (!confirmed) return;

        dispatch(clearUserFeedback());

        if (user.isBlocked) {
            await dispatch(unblockUserThunk(user._id));
        } else {
            await dispatch(blockUserThunk(user._id));
        }
    };

    // Permanently delete a customer after confirmation.
    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `Permanently delete ${user.email}? This action cannot be undone.`
        );

        if (!confirmed) return;

        dispatch(clearUserFeedback());
        await dispatch(deleteUserThunk(user._id));
    };


return (
    <div className="min-h-screen space-y-6 bg-[#f7f9ff] p-4 text-[#263d32] transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100 sm:p-6 md:p-8">

        {/* Page heading */}
        <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#263d32] dark:text-white sm:text-3xl">
                User Management
            </h1>

            <p className="mt-2 text-sm text-[#77847d] dark:text-gray-400">
                View and manage TinyNest customer accounts.
            </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
                {
                    title: "Total Customers",
                    count: users.length,
                    description: "Registered customer accounts",
                    color: "text-[#263d32] dark:text-white",
                },
                {
                    title: "Verified Customers",
                    count: users.filter((user) => user.isVerified).length,
                    description: "Accounts with verified details",
                    color: "text-[#436558] dark:text-emerald-300",
                },
                {
                    title: "Blocked Customers",
                    count: users.filter((user) => user.isBlocked).length,
                    description: "Accounts currently restricted",
                    color: "text-[#bd8069] dark:text-orange-300",
                },
            ].map((item) => (
                <div
                    key={item.title}
                    className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900"
                >
                    <p className="text-sm font-medium text-[#77847d] dark:text-gray-400">
                        {item.title}
                    </p>

                    <p className={`mt-3 text-3xl font-semibold ${item.color}`}>
                        {item.count}
                    </p>

                    <p className="mt-1 text-xs text-[#77847d] dark:text-gray-400">
                        {item.description}
                    </p>
                </div>
            ))}
        </div>

        {/* Search customers */}
        <section className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
            <label
                htmlFor="userSearch"
                className="mb-2 block text-sm font-semibold text-[#263d32] dark:text-gray-200"
            >
                Search Customers
            </label>

            <input
                id="userSearch"
                type="text"
                placeholder="Search by email or phone..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-[#dce7e2] bg-[#f7f9ff] px-4 py-3 text-sm text-[#263d32] outline-none transition placeholder:text-[#9aa69f] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#7a9e8f]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#7a9e8f]"
            />
        </section>

        {/* API error */}
        {error && (
            <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
                {error}
            </div>
        )}

        {/* Action error */}
        {actionError && (
            <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
                {actionError}
            </div>
        )}

        {/* Successful action feedback */}
        {actionSuccess && (
            <div
                role="status"
                className="rounded-xl border border-[#dce7e2] bg-[#edf4f0] p-4 text-sm font-medium text-[#436558] dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
            >
                {actionSuccess}
            </div>
        )}

        {/* Customer table */}
        <section className="overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dce7e2] border-t-[#436558] dark:border-gray-700 dark:border-t-[#a9cfbe]" />

                    <p className="mt-4 text-sm text-[#77847d] dark:text-gray-400">
                        Loading customers...
                    </p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center">
                    <h3 className="font-serif text-lg font-semibold text-[#263d32] dark:text-white">
                        No customers found
                    </h3>

                    <p className="mt-2 text-sm text-[#77847d] dark:text-gray-400">
                        Try a different search.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">

                        <thead className="border-b border-[#e0e7e3] bg-[#f1f4f9] dark:border-gray-800 dark:bg-gray-800">
                            <tr>
                                {[
                                    "Customer",
                                    "Phone",
                                    "Verification",
                                    "Account Status",
                                    "Joined",
                                    "Actions",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d] dark:text-gray-300"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#edf1ee] dark:divide-gray-800">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="transition-colors hover:bg-[#f7f9ff] dark:hover:bg-gray-800/60"
                                >
                                    {/* Customer details */}
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-[#263d32] dark:text-gray-100">
                                            {user.email}
                                        </p>

                                        <p className="mt-1 text-xs text-[#9aa69f] dark:text-gray-500">
                                            ID: {user._id}
                                        </p>
                                    </td>

                                    {/* Phone */}
                                    <td className="px-6 py-4 text-sm text-[#46574e] dark:text-gray-300">
                                        {user.phone || "N/A"}
                                    </td>

                                    {/* Verification */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                                user.isVerified
                                                    ? "border-[#dce7e2] bg-[#edf4f0] text-[#436558] dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                    : "border-[#f0dfc4] bg-[#fbf3e5] text-[#98703d] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                                            }`}
                                        >
                                            {user.isVerified ? "Verified" : "Unverified"}
                                        </span>
                                    </td>

                                    {/* Account status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                                user.isBlocked
                                                    ? "border-[#f0d8d0] bg-[#fbf0eb] text-[#a65f4c] dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                                                    : "border-[#dce7e2] bg-[#edf4f0] text-[#436558] dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                            }`}
                                        >
                                            {user.isBlocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>

                                    {/* Registration date */}
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#77847d] dark:text-gray-400">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    {/* Existing account actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() => handleToggleBlock(user)}
                                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    user.isBlocked
                                                        ? "border-[#dce7e2] bg-[#edf4f0] text-[#436558] hover:bg-[#dce7e2] dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                                                        : "border-[#f0dfc4] bg-[#fbf3e5] text-[#98703d] hover:bg-[#f7ead3] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/70"
                                                }`}
                                            >
                                                {user.isBlocked ? "Unblock" : "Block"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() => handleDelete(user)}
                                                className="rounded-lg border border-[#f0d8d0] bg-[#fbf0eb] px-3 py-2 text-xs font-semibold text-[#a65f4c] transition hover:bg-[#f5e2da] disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>

        {/* Customer count */}
        <p className="text-sm text-[#77847d] dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} customers.
        </p>
    </div>
);


}

export default AdminUsers;
