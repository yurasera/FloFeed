import { useCallback, useEffect, useState } from 'react'
import type { FeedbackHistoryEntry, LearnerProgressSummary } from '../types/feedback'
import { getFeedbackHistory, getLearnerProgressSummary } from '../services/historyService'

export function useFeedbackHistory(learnerId: string | undefined) {
    const [history, setHistory] = useState<FeedbackHistoryEntry[]>([])
    const [progress, setProgress] = useState<LearnerProgressSummary | null>(null)
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        if (!learnerId) {
            setHistory([])
            setProgress(null)
            return
        }
        setLoading(true)
        const [historyResult, progressResult] = await Promise.all([
            getFeedbackHistory(learnerId),
            getLearnerProgressSummary(learnerId),
        ])
        setHistory(historyResult)
        setProgress(progressResult)
        setLoading(false)
    }, [learnerId])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return { history, progress, loading, refresh }
}
