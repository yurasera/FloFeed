import { Card } from './Card'

type InsightCardProps = {
    title: string
    value: string | number
    description?: string
}

export function InsightCard({ title, value, description }: InsightCardProps) {
    return (
        <Card className="space-y-2 p-5 shadow-none">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
            <p className="text-3xl font-semibold text-slate-900">{value}</p>
            {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </Card>
    )
}
