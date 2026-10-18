
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getProfileThunk,
    updateProfileThunk
} from "../../features/auth/authThunk";

import {
    selectAuthUser,
    selectProfileSaving,
    selectProfileError
} from "../../features/auth/authSelectors";

function Profile() {
    const dispatch = useDispatch();

    // Read the signed-in user and profile-save status from Redux.
    const user = useSelector(selectAuthUser);
    const saving = useSelector(selectProfileSaving);
    const error = useSelector(selectProfileError);

    // Keep editable form values separate from the stored user object.
    const [formData, setFormData] = useState({
        fullName: "",
        phone: ""
    });

    const [success, setSuccess] = useState("");

    // Fetch the profile if it hasn't been loaded yet.
    useEffect(() => {
        if (!user) {
            dispatch(getProfileThunk());
        }
    }, [dispatch, user]);

    // Populate the form whenever Redux receives profile data.
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                phone: user.phone || ""
            });
        }
    }, [user]);

    // Update the appropriate form field when the user types.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        // Clear the previous success message after editing.
        setSuccess("");
    };

    // Submit only the editable profile fields.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess("");

        try {
            await dispatch(
                updateProfileThunk({
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim()
                })
            ).unwrap();

            // The Redux fulfilled reducer also updates the stored user.
            setSuccess("Profile updated successfully.");
        } catch {
            // The error message is displayed from Redux below.
            // No extra action is needed here.
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        My Profile
                    </h1>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Manage your account information.
                    </p>
                </div>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full name is editable. */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-medium"
                            >
                                Full name
                            </label>

                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                maxLength={100}
                                required
                                autoComplete="name"
                                placeholder="Enter your full name"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-pink-900"
                            />
                        </div>

                        {/* Email is visible but cannot be edited here. */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                aria-readonly="true"
                                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            />

                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Email cannot be changed from this page.
                            </p>
                        </div>

                        {/* Phone is editable. */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-medium"
                            >
                                Phone number
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={20}
                                required
                                autoComplete="tel"
                                placeholder="Enter your phone number"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-pink-900"
                            />
                        </div>

                        {/* Display API errors and success feedback. */}
                        {error && (
                            <p role="alert" className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p role="status" className="text-sm text-green-600">
                                {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving || !user}
                            className="w-full rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </form>
                </section>

                {/* Role is displayed for clarity, never submitted for editing. */}
                {user?.role && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Account type:{" "}
                        <span className="font-medium capitalize">
                            {user.role}
                        </span>
                    </p>
                )}
            </div>
        </main>
    );
}

export default Profile;
