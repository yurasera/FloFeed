type SectionTitleProps = {
    eyebrow?: string
    title: string
    description?: string
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
    return (
        <div className="space-y-2">
            {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p> : null}
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
            {description ? <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
        </div>
    )
}