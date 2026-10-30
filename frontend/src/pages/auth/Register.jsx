
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../validations/auth/registerSchema";
import { registerUserThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function Register() {

    // // Controls password visibility independently.
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Initialize React Hook Form with Yup validation.
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Clear errors left behind by Login or another auth page.
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    // Read the current request status and API error from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // Validate the form, register the user, and navigate to OTP verification.
    // Called only when all registration fields pass Yup validation.
    const handleRegister = async (data) => {
        const cleanedEmail = data.email.trim();
        const cleanedPhone = data.phone.trim();

        try {
            // Submit valid registration data through the existing Redux thunk.
            await dispatch(
                registerUserThunk({
                    email: cleanedEmail,
                    phone: cleanedPhone,
                    password: data.password,
                    confirmPassword: data.confirmPassword,
                })
            ).unwrap();

            // Navigate to OTP verification after successful registration.
            navigate(
                `/verify-otp?email=${encodeURIComponent(cleanedEmail)}`
            );
        } catch {
            // Redux handles and stores the API error.
        }
    };

    // Display errors returned by the backend through Redux.
    const displayedError = error;



    return (
        <main className="relative min-h-[calc(100dvh-80px)] overflow-hidden bg-[#f7f9ff] px-4 py-8 text-[#181c20] dark:bg-gray-950 sm:px-6 lg:px-8 lg:py-12">
            {/* Soft decorative background shapes from the TinyNest design. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#dce7e2]/70 blur-3xl dark:bg-emerald-950/30"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#f0bba5]/20 blur-3xl dark:bg-amber-950/20"
            />

            {/* Main two-column authentication card. */}
            <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e0e3e8] bg-white shadow-[0_8px_40px_-12px_rgba(43,47,51,0.12)] dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-[0.9fr_1.1fr]">

                {/* LEFT PANEL: TinyNest branding and editorial image. */}
                <aside className="relative flex flex-col justify-between overflow-hidden bg-[#f1f4f9] p-6 dark:bg-gray-800 sm:p-8 lg:p-10">
                    {/* Decorative circle. */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-[#dce7e2]/70 dark:border-white/5"
                    />

                    <div className="relative z-10">
                        {/* Brand logo. */}
                        <Link
                            to="/"
                            aria-label="TinyNest home"
                            className="inline-flex items-center gap-2 font-serif text-3xl tracking-tight text-[#436558] transition hover:opacity-80 dark:text-[#a9cfbe]"
                        >
                            TinyNest
                            <span className="text-[#7d5543]">.</span>
                        </Link>

                        {/* Brand badge. */}
                        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#dce7e2] px-3 py-2 text-xs font-semibold text-[#315447] dark:bg-emerald-950 dark:text-emerald-200">
                            <span aria-hidden="true">✿</span>
                            Thoughtfully chosen for little ones
                        </div>

                        {/* Main image from the reference design. */}
                        <div className="group relative mt-5 h-52 overflow-hidden rounded-xl shadow-sm sm:h-64 lg:h-60">
                            <img
                                src="https://images.unsplash.com/photo-1510154221590-ff63e90a136f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                                alt="A peaceful setting representing thoughtful care for little ones"
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            {/* Image gradient overlay. */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181c20]/50 via-transparent to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#181c20] backdrop-blur">
                                    Little beginnings
                                </span>

                                <span className="rounded-full bg-[#dce7e2]/95 px-3 py-1.5 text-xs font-semibold text-[#315447]">
                                    Made with love ♡
                                </span>
                            </div>
                        </div>

                        {/* Editorial heading and description. */}
                        <div className="mt-7">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#436558] dark:text-[#a9cfbe]">
                                LITTLE THINGS, LOTS OF LOVE
                            </p>

                            <h1 className="max-w-md font-serif text-3xl font-normal leading-tight tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                                Gentle beginnings for your little one.
                            </h1>

                            <p className="mt-4 max-w-md text-sm leading-7 text-[#414845] dark:text-gray-300 sm:text-base">
                                Discover thoughtful baby essentials selected
                                to bring comfort, care, and a little extra
                                love to every milestone.
                            </p>
                        </div>
                    </div>

                    {/* Bottom reassurance section. */}
                    <div className="relative z-10 mt-8 border-t border-[#c1c8c3]/70 pt-5 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl text-[#436558] shadow-sm dark:bg-gray-700 dark:text-[#a9cfbe]">
                                ♡
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#181c20] dark:text-white">
                                    Care in every little detail
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                    A little care for every little one.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT PANEL: Registration form. */}
                <section className="flex items-center justify-center bg-white p-6 dark:bg-gray-900 sm:p-8 lg:p-12">
                    <div className="w-full max-w-md">

                        {/* Sign-in and registration switch. */}
                        <div className="mb-8 flex items-center justify-between gap-3">
                            <div className="inline-flex rounded-full bg-[#ebeef3] p-1 dark:bg-gray-800">
                                <Link
                                    to="/login"
                                    className="rounded-full px-4 py-2 text-sm font-medium text-[#414845] transition hover:text-[#436558] dark:text-gray-300"
                                >
                                    Sign In
                                </Link>

                                <span
                                    aria-current="page"
                                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#436558] shadow-sm dark:bg-gray-700 dark:text-[#a9cfbe]"
                                >
                                    Create Account
                                </span>
                            </div>
                        </div>

                        {/* Registration heading. */}
                        <div className="mb-7">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d5543]">
                                JOIN THE TINYNEST FAMILY
                            </p>

                            <h2 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                                Create account
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                A few details, and you're ready to begin.
                            </p>
                        </div>

                        {/* Preserve your existing error variable and behavior. */}
                        {displayedError && (
                            <p
                                role="alert"
                                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            >
                                {typeof displayedError === "string"
                                    ? displayedError
                                    : "Registration failed. Please check your details and try again."}
                            </p>
                        )}

                        {/* Existing form logic is preserved. */}
                        <form
                            onSubmit={handleSubmit(handleRegister)}
                            className="space-y-5"
                        >
                            {/* Email field */}
                            <div>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                dispatch(clearAuthError());
                                                field.onChange(e);
                                            }}
                                            label="Email address"
                                            type="email"
                                            placeholder="you@example.com"
                                            disabled={loading}
                                        />
                                    )}
                                />

                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone field */}
                            <div>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                dispatch(clearAuthError());
                                                field.onChange(e);
                                            }}
                                            label="Phone number"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            disabled={loading}
                                        />
                                    )}
                                />

                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div>
                                {/* Password field */}
                                <div>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        dispatch(clearAuthError());
                                                        field.onChange(e);
                                                    }}
                                                    label="Password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a password"
                                                    disabled={loading}
                                                />

                                                {/* Show/Hide password */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    disabled={loading}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                    className="absolute right-4 top-[42px] text-gray-500 transition hover:text-[#436558] dark:text-gray-400 dark:hover:text-[#a9cfbe]"
                                                >
                                                    {showPassword ? (
                                                        <EyeOffIcon />
                                                    ) : (
                                                        <EyeIcon />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    />

                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm password field */}
                            <div>
                                {/* Confirm password field */}
                                <div>
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        dispatch(clearAuthError());
                                                        field.onChange(e);
                                                    }}
                                                    label="Confirm password"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Enter your password again"
                                                    disabled={loading}
                                                />

                                                {/* Show/Hide confirm password */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    disabled={loading}
                                                    aria-label={
                                                        showConfirmPassword
                                                            ? "Hide confirm password"
                                                            : "Show confirm password"
                                                    }
                                                    className="absolute right-4 top-[42px] text-gray-500 transition hover:text-[#436558] dark:text-gray-400 dark:hover:text-[#a9cfbe]"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOffIcon />
                                                    ) : (
                                                        <EyeIcon />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    />

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                            </div>
                            {/* Existing TinyNest button */}
                            <div className="pt-1">
                                <Button
                                    type="submit"
                                    variant="auth"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading ? "Creating account..." : "Create My Account →"}
                                </Button>
                            </div>
                        </form>

                        {/* Footer text from the reference. */}
                        <p className="mt-6 text-center text-xs leading-5 text-[#717974] dark:text-gray-500">
                            <span aria-hidden="true">♡ </span>
                            Little things, lots of love.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );

}
// Eye icon for showing the password.
function EyeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

// Eye-off icon for hiding the password.
function EyeOffIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
            <path d="M9.88 5.09A10.8 10.8 0 0 1 12 4.87c5 0 9 5.13 10 7.13a13.2 13.2 0 0 1-3.17 4.11" />
            <path d="M6.61 6.61C3.92 8.05 2.45 10.2 2 12c1 2 5 7.13 10 7.13a10.8 10.8 0 0 0 4.11-.81" />
        </svg>
    );
}
export default Register;