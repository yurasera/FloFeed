type InlineStateMessageProps = {
    title: string
    description: string
}

export function InlineStateMessage({ title, description }: InlineStateMessageProps) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    )
}