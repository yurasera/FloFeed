import type { MoodDistribution } from '../types/insights'

type MoodChartProps = {
    data: MoodDistribution[]
}

export function MoodChart({ data }: MoodChartProps) {
    return (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Distribusi Mood</h3>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.mood} className="space-y-1">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>{item.mood}</span>
                            <span>{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.max(item.percentage, 8)}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
