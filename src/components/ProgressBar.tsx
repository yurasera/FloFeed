type ProgressBarProps = {
    value?: number
}

export function ProgressBar({ value = 0 }: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value))

    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-full rounded-full bg-blue-600 transition-[width]"
                style={{ width: `${clampedValue}%` }}
                aria-hidden="true"
            />
        </div>
    )
}