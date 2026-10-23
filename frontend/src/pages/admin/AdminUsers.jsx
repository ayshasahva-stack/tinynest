
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
    <div className="min-h-screen space-y-6 bg-[#f7f9ff] p-4 text-[#263d32] sm:p-6 md:p-8">
        {/* Page heading */}
        <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#263d32] sm:text-3xl">
                User Management
            </h1>

            <p className="mt-2 text-sm text-[#77847d]">
                View and manage TinyNest customer accounts.
            </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-[#77847d]">
                    Total Customers
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#263d32]">
                    {users.length}
                </p>

                <p className="mt-1 text-xs text-[#77847d]">
                    Registered customer accounts
                </p>
            </div>

            <div className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-[#77847d]">
                    Verified Customers
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#436558]">
                    {users.filter((user) => user.isVerified).length}
                </p>

                <p className="mt-1 text-xs text-[#77847d]">
                    Accounts with verified details
                </p>
            </div>

            <div className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-[#77847d]">
                    Blocked Customers
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#bd8069]">
                    {users.filter((user) => user.isBlocked).length}
                </p>

                <p className="mt-1 text-xs text-[#77847d]">
                    Accounts currently restricted
                </p>
            </div>
        </div>

        {/* Search customers */}
        <section className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
            <label
                htmlFor="userSearch"
                className="mb-2 block text-sm font-semibold text-[#263d32]"
            >
                Search Customers
            </label>

            <input
                id="userSearch"
                type="text"
                placeholder="Search by email or phone..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-[#dce7e2] bg-[#f7f9ff] px-4 py-3 text-sm text-[#263d32] outline-none transition placeholder:text-[#9aa69f] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#7a9e8f]/20"
            />
        </section>

        {/* API error */}
        {error && (
            <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
                {error}
            </div>
        )}

        {/* Action error feedback */}
        {actionError && (
            <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
                {actionError}
            </div>
        )}

        {/* Successful action feedback */}
        {actionSuccess && (
            <div
                role="status"
                className="rounded-xl border border-[#dce7e2] bg-[#edf4f0] p-4 text-sm font-medium text-[#436558]"
            >
                {actionSuccess}
            </div>
        )}

        {/* Customer table */}
        <section className="overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-sm">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dce7e2] border-t-[#436558]" />

                    <p className="mt-4 text-sm text-[#77847d]">
                        Loading customers...
                    </p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center">
                    <h3 className="font-serif text-lg font-semibold text-[#263d32]">
                        No customers found
                    </h3>

                    <p className="mt-2 text-sm text-[#77847d]">
                        Try a different search.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="border-b border-[#e0e7e3] bg-[#f1f4f9]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d]">
                                    Customer
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d]">
                                    Phone
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d]">
                                    Verification
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d]">
                                    Account Status
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d]">
                                    Joined
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#77847d]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#edf1ee]">
                            {filteredUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className="transition-colors hover:bg-[#f7f9ff]"
                                >
                                    {/* Customer details */}
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-[#263d32]">
                                            {user.email}
                                        </p>

                                        <p className="mt-1 text-xs text-[#9aa69f]">
                                            ID: {user._id}
                                        </p>
                                    </td>

                                    {/* Phone number */}
                                    <td className="px-6 py-4 text-sm text-[#46574e]">
                                        {user.phone || "N/A"}
                                    </td>

                                    {/* Verification status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                user.isVerified
                                                    ? "border border-[#dce7e2] bg-[#edf4f0] text-[#436558]"
                                                    : "border border-[#f0dfc4] bg-[#fbf3e5] text-[#98703d]"
                                            }`}
                                        >
                                            {user.isVerified
                                                ? "Verified"
                                                : "Unverified"}
                                        </span>
                                    </td>

                                    {/* Account status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                user.isBlocked
                                                    ? "border border-[#f0d8d0] bg-[#fbf0eb] text-[#a65f4c]"
                                                    : "border border-[#dce7e2] bg-[#edf4f0] text-[#436558]"
                                            }`}
                                        >
                                            {user.isBlocked
                                                ? "Blocked"
                                                : "Active"}
                                        </span>
                                    </td>

                                    {/* Registration date */}
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#77847d]">
                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    {/* Existing account actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleToggleBlock(user)
                                                }
                                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    user.isBlocked
                                                        ? "border-[#dce7e2] bg-[#edf4f0] text-[#436558] hover:bg-[#dce7e2]"
                                                        : "border-[#f0dfc4] bg-[#fbf3e5] text-[#98703d] hover:bg-[#f7ead3]"
                                                }`}
                                            >
                                                {user.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                className="rounded-lg border border-[#f0d8d0] bg-[#fbf0eb] px-3 py-2 text-xs font-semibold text-[#a65f4c] transition hover:bg-[#f5e2da] disabled:cursor-not-allowed disabled:opacity-50"
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
        <p className="text-sm text-[#77847d]">
            Showing {filteredUsers.length} of {users.length} customers.
        </p>
    </div>
);

}

export default AdminUsers;
