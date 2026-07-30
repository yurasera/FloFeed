import type { FeedbackHistoryEntry } from '../types/feedback'
import { HistoryCard } from './HistoryCard'

type HistoryListProps = {
    entries: FeedbackHistoryEntry[]
}

export function HistoryList({ entries }: HistoryListProps) {
    return (
        <div className="space-y-3">
            {entries.map((entry) => (
                <HistoryCard key={entry.id} entry={entry} />
            ))}
        </div>
    )
}
