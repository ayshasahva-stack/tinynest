
import { LoaderCircle } from "lucide-react";

function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f7f9ff] text-[#181c20] dark:bg-gray-950 dark:text-gray-100">
            <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#dce7e2] opacity-80 blur-xl dark:bg-[#436558]" />

                <LoaderCircle
                    size={56}
                    strokeWidth={2}
                    className="relative animate-spin text-[#436558] dark:text-[#a9cfbe]"
                    aria-hidden="true"
                />
            </div>

            <div className="text-center">
                <p className="mt-2 animate-pulse text-sm text-gray-500 dark:text-gray-400">
                    Preparing something lovely...
                </p>
            </div>
        </div>
    );
}

export default Loading;
