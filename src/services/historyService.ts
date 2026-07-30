import type { FeedbackHistoryEntry, LearnerProgressSummary } from '../types/feedback'
import { feedbackService } from './feedbackService'
import { completionService } from './completionService'
import { mockClasses } from '../data/mockClasses'

const POINTS_PER_FEEDBACK = 10

export async function getFeedbackHistory(learnerId: string): Promise<FeedbackHistoryEntry[]> {
    const completions = await completionService.getLearnerCompletions(learnerId)
    const allFeedback = await feedbackService.getAllFeedback()

    // Build history entries from completions matched to feedback responses
    const entries: FeedbackHistoryEntry[] = []

    for (const completion of completions) {
        const matchingFeedback = allFeedback.find(
            (fb) => fb.classId === completion.classId,
        )
        const classRecord = mockClasses.find((c) => c.id === completion.classId)

        entries.push({
            id: `history-${completion.learnerId}-${completion.classId}`,
            learnerId: completion.learnerId,
            classId: completion.classId,
            className: classRecord?.name ?? completion.classId,
            selectedMood: matchingFeedback?.selectedMood ?? '',
            createdAt: completion.submittedAt,
            pointsEarned: POINTS_PER_FEEDBACK,
        })
    }

    // Sort newest first
    return entries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export async function getLearnerProgressSummary(learnerId: string): Promise<LearnerProgressSummary> {
    const history = await getFeedbackHistory(learnerId)

    const totalFeedback = history.length
    const totalPoints = history.reduce((sum, entry) => sum + entry.pointsEarned, 0)

    const sorted = [...history].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    const lastSubmittedAt = sorted.length > 0 ? sorted[0].createdAt : null

    // Simple streak calculation: count consecutive days with submissions (from today going back)
    let currentStreak = 0
    if (sorted.length > 0) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const submissionDays = new Set(
            sorted.map((entry) => {
                const d = new Date(entry.createdAt)
                d.setHours(0, 0, 0, 0)
                return d.getTime()
            }),
        )

        let checkDate = new Date(today)
        // Allow streak to start from today or yesterday
        if (!submissionDays.has(checkDate.getTime())) {
            checkDate.setDate(checkDate.getDate() - 1)
        }

        while (submissionDays.has(checkDate.getTime())) {
            currentStreak++
            checkDate.setDate(checkDate.getDate() - 1)
        }
    }

    return {
        learnerId,
        totalFeedback,
        totalPoints,
        lastSubmittedAt,
        currentStreak,
    }
}
