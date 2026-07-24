export function IllustrationPlaceholder() {
    return (
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-6">
            <div className="absolute h-32 w-32 animate-pulse rounded-full bg-blue-200/30" />

            <div className="relative space-y-4 text-center">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-20" />

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-5xl shadow-lg">
                        🛡️
                    </div>
                </div>
            </div>
        </div>
    )
}