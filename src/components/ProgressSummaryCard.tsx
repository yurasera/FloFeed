import { Card } from './Card'
import type { LearnerProgressSummary } from '../types/feedback'

type ProgressSummaryCardProps = {
    progress: LearnerProgressSummary
}

export function ProgressSummaryCard({ progress }: ProgressSummaryCardProps) {
    const lastDate = progress.lastSubmittedAt ? new Date(progress.lastSubmittedAt) : null

    return (
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
            <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Progress Anda</p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                        <p className="text-3xl font-semibold text-slate-900">{progress.totalFeedback}</p>
                        <p className="mt-1 text-sm text-slate-600">Total feedback</p>
                    </div>
                    <div>
                        <p className="text-3xl font-semibold text-emerald-600">{progress.totalPoints}</p>
                        <p className="mt-1 text-sm text-slate-600">Total poin</p>
                    </div>
                    <div>
                        <p className="text-3xl font-semibold text-amber-600">{progress.currentStreak}</p>
                        <p className="mt-1 text-sm text-slate-600">Hari streak</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-slate-900">
                            {lastDate
                                ? lastDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                : '—'}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">Terakhir submit</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
