import { Card } from './Card'
import type { FeedbackHistoryEntry } from '../types/feedback'

const moodEmojis: Record<string, string> = {
    'very-happy': '😍',
    happy: '😊',
    neutral: '😐',
    confused: '😕',
    disappointed: '😞',
}

type HistoryCardProps = {
    entry: FeedbackHistoryEntry
}

export function HistoryCard({ entry }: HistoryCardProps) {
    const emoji = moodEmojis[entry.selectedMood] ?? '•'
    const date = new Date(entry.createdAt)

    return (
        <Card className="flex items-center gap-4 p-5 shadow-none transition hover:shadow-md">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl ring-1 ring-inset ring-blue-100">
                {emoji}
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{entry.className}</p>
                <p className="mt-0.5 text-sm text-slate-600">
                    {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}
                    {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-lg font-semibold text-emerald-600">+{entry.pointsEarned}</p>
                <p className="text-xs text-slate-500">poin</p>
            </div>
        </Card>
    )
}
