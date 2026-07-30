import { useCallback, useEffect, useState } from 'react'
import { completionService } from '../services/completionService'
import type { FeedbackCompletion, ClassRoster, CompletionSummary } from '../types/feedback'

export function useLearnerCompletionStatus(learnerId: string | undefined, classId: string | undefined) {
    const [completion, setCompletion] = useState<FeedbackCompletion | null>(null)
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        if (!learnerId || !classId) {
            setCompletion(null)
            return
        }
        setLoading(true)
        const result = await completionService.getLearnerCompletion(learnerId, classId)
        setCompletion(result)
        setLoading(false)
    }, [learnerId, classId])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return { completion, loading, refresh }
}

export function useLearnerClassCompletions(learnerId: string | undefined) {
    const [completions, setCompletions] = useState<FeedbackCompletion[]>([])
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        if (!learnerId) {
            setCompletions([])
            return
        }
        setLoading(true)
        const result = await completionService.getLearnerCompletions(learnerId)
        setCompletions(result)
        setLoading(false)
    }, [learnerId])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return { completions, loading, refresh }
}

export function useClassCompletionSummary(classId: string | undefined) {
    const [summary, setSummary] = useState<CompletionSummary | null>(null)
    const [roster, setRoster] = useState<ClassRoster | null>(null)
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        if (!classId) {
            setSummary(null)
            setRoster(null)
            return
        }
        setLoading(true)
        const [summaryResult, rosterResult] = await Promise.all([
            completionService.getCompletionSummary(classId),
            completionService.getClassRoster(classId),
        ])
        setSummary(summaryResult)
        setRoster(rosterResult)
        setLoading(false)
    }, [classId])

    useEffect(() => {
        void refresh()
    }, [refresh])

    return { summary, roster, loading, refresh }
}
