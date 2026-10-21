
import { Link } from "react-router-dom";

// Shared layout for TinyNest authentication pages
function AuthLayout({
    eyebrow = "WELCOME TO TINYNEST",
    title,
    description,
    children,
    footer,
}) {
    return (
        <section className="bg-[#FAF8F5] px-4 py-8 transition-colors duration-300 dark:bg-[#171B19] sm:px-6 sm:py-12 lg:py-14">

            {/* Main card: two columns on desktop */}
            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white shadow-[0_18px_60px_rgba(48,61,51,0.08)] dark:border-[#343B36] dark:bg-[#202622] lg:min-h-[570px] lg:grid-cols-[0.9fr_1.1fr]">

                {/* Left panel: branding and welcome message */}
                <aside className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#E8EEE6] p-6 dark:bg-[#29352D] sm:p-8 lg:min-h-full lg:p-10">

                    {/* Decorative background shapes */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border-[26px] border-white/35 dark:border-white/5"
                    />

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[#D5E1D1]/80 dark:bg-[#364638]/80"
                    />

                    {/* TinyNest logo links back to the home page */}
                    <Link
                        to="/"
                        className="relative z-10 inline-flex w-fit items-center gap-2 text-xl font-semibold tracking-tight text-[#456354] transition hover:opacity-80 dark:text-[#C4D6C2]"
                    >
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-lg text-[#7A9E8F] shadow-sm dark:bg-white/10"
                            aria-hidden="true"
                        >
                            ♡
                        </span>

                        TinyNest
                        <span className="text-[#D49F89]">.</span>
                    </Link>

                    {/* Welcome text */}
                    <div className="relative z-10 mt-8 max-w-sm lg:mb-8 lg:mt-12">
                        <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[#6B8877] dark:text-[#B4CBB8]">
                            {eyebrow}
                        </p>

                        <h2 className="max-w-xs text-3xl font-semibold leading-tight tracking-tight text-[#2E4036] dark:text-[#F0F3ED] sm:text-4xl">
                            Little essentials, lots of love.
                        </h2>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-[#5E7165] dark:text-[#C0CBC1] sm:text-base">
                            Thoughtfully selected baby essentials for every
                            little journey, filled with comfort, care, and love.
                        </p>
                    </div>

                    {/* Decorative elements; no external images required */}
                    <div
                        aria-hidden="true"
                        className="relative z-10 mt-7 hidden h-24 items-end gap-3 sm:flex lg:mt-0 lg:h-28"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/75 text-3xl shadow-sm dark:bg-white/10">
                            ☁
                        </div>

                        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-[#D4E1D0] text-4xl text-[#66816F] shadow-sm dark:bg-[#3A4B3C] dark:text-[#D3E1CF]">
                            ♡
                        </div>

                        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#F3D9CB] text-2xl text-[#956B58] shadow-sm dark:bg-[#624B40] dark:text-[#F2D4C4]">
                            ✦
                        </div>
                    </div>

                    <p className="relative z-10 mt-6 hidden text-xs text-[#708477] dark:text-[#A9BBAA] lg:block">
                        Made with love for little beginnings.
                    </p>
                </aside>

                {/* Right panel: page-specific form */}
                <div className="flex items-center justify-center p-6 sm:p-9 lg:p-12">
                    <div className="w-full max-w-md">

                        {/* Page-specific heading and description */}
                        <div className="mb-7 sm:mb-8">
                            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#7A9E8F] dark:text-[#A9C6B0]">
                                {eyebrow}
                            </p>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#2B2F33] dark:text-[#F3F4F1] sm:text-3xl">
                                {title}
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-[#777D78] dark:text-[#B5BDB7]">
                                {description}
                            </p>
                        </div>

                        {/* Displays the form passed by Login or Register */}
                        {children}

                        {/* Optional footer, such as a Register link */}
                        {footer && (
                            <div className="mt-7 border-t border-[#EEEAE4] pt-5 text-center dark:border-[#39413B]">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Shared footer */}
            <p className="mx-auto mt-5 max-w-5xl text-center text-xs text-[#939991] dark:text-[#8F9B91]">
                A little care for every little one.{" "}
                <span aria-hidden="true">♡</span>
            </p>
        </section>
    );
}

export default AuthLayout;
