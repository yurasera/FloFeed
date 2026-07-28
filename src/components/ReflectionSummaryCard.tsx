import type { ReflectionSummary } from '../types/insights'

type ReflectionSummaryCardProps = {
    items: ReflectionSummary[]
}

export function ReflectionSummaryCard({ items }: ReflectionSummaryCardProps) {
    return (
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Ringkasan refleksi</h3>
            {items.length > 0 ? (
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={`${item.category}-${item.summary}`} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                            <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-slate-900">{item.category}</p>
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{item.frequency}x</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-slate-500">Belum ada refleksi yang cukup untuk dirangkum.</p>
            )}
        </div>
    )
}
