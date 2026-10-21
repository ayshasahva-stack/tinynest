
const benefits = [
    {
        icon: "🚚",
        title: "Free Shipping",
        description: "On orders above ₹999",
    },
    {
        icon: "🌿",
        title: "Organic Essentials",
        description: "100% GOTS certified organic",
    },
    {
        icon: "♡",
        title: "Made with Care",
        description: "Thoughtful essentials for little ones",
    },
    {
        icon: "✦",
        title: "Little Things, Lots of Love",
        description: "Thoughtfully chosen for your baby",
    },
];

function BenefitsSection() {
    return (
        <section className="border-y border-[#E8E8DF] px-5 py-10 dark:border-gray-800 dark:bg-gray-900 sm:px-8 sm:py-12 lg:px-10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-8">
                {benefits.map((benefit) => (
                    <div
                        key={benefit.title}
                        className="flex flex-col items-center text-center"
                    >
                        {/* Soft sage icon container matching the reference palette. */}
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E1E9DC] text-xl text-[#405B43] dark:bg-[#344638] dark:text-[#E2EBDD]">
                            <span aria-hidden="true">{benefit.icon}</span>
                        </div>

                        <h3 className="text-sm font-semibold text-[#292D29] dark:text-gray-100">
                            {benefit.title}
                        </h3>

                        <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#777C75] dark:text-gray-400 sm:text-sm">
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BenefitsSection;
