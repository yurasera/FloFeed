type FeedbackTextareaFieldProps = {
    id: string
    label: string
    value: string
    onChange: (value: string) => void
}

export function FeedbackTextareaField({ id, label, value, onChange }: FeedbackTextareaFieldProps) {
    const characterCount = value.length

    return (
        <div className="space-y-2 text-left">
            <label htmlFor={id} className="block text-sm font-semibold text-slate-800 sm:text-base">
                {label}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={5}
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm shadow-slate-900/5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                placeholder="Tulis jawaban Anda"
            />
            <div className="flex justify-end text-xs font-medium text-slate-500">
                <span>{characterCount} karakter</span>
            </div>
        </div>
    )
}