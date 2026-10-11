
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
        <div className="min-h-screen p-6 md:p-8">
            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    User Management
                </h1>

                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    View and manage TinyNest customer accounts.
                </p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Customers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {users.length}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Verified Customers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {users.filter((user) => user.isVerified).length}
                    </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Blocked Customers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                        {users.filter((user) => user.isBlocked).length}
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <label
                    htmlFor="userSearch"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                    Search Customers
                </label>

                <input
                    id="userSearch"
                    type="text"
                    placeholder="Search by email or phone..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* API error */}
            {error && (
                <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Action feedback */}
            {actionError && (
                <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {actionError}
                </div>
            )}

            {actionSuccess && (
                <div role="status" className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                    {actionSuccess}
                </div>
            )}

            {/* Customer table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Loading customers...
                        </p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-16 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            No customers found
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Try a different search.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Verification
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Account Status
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Joined
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {user.email}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                ID: {user._id}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {user.phone || "N/A"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                user.isVerified
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                                {user.isVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                user.isBlocked
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                                {user.isBlocked ? "Blocked" : "Active"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    disabled={actionLoading}
                                                    onClick={() => handleToggleBlock(user)}
                                                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                        user.isBlocked
                                                            ? "border-green-200 text-green-700 hover:bg-green-50"
                                                            : "border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                                                    }`}
                                                >
                                                    {user.isBlocked ? "Unblock" : "Block"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={actionLoading}
                                                    onClick={() => handleDelete(user)}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredUsers.length} of {users.length} customers.
            </p>
        </div>
    );
}

export default AdminUsers;
