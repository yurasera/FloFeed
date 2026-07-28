import { feedbackService } from './feedbackService'
import type { FeedbackInsight, ReflectionSummary } from '../types/insights'
import type { FeedbackResponse } from '../types/feedback'

const moodLabels: Record<string, string> = {
    'very-happy': 'Sangat Puas',
    happy: 'Puas',
    neutral: 'Biasa Saja',
    confused: 'Bingung',
    disappointed: 'Kecewa',
}

function summarizeReflection(responses: FeedbackResponse[]): ReflectionSummary[] {
    const grouped = responses.reduce<Record<string, number>>((accumulator, response) => {
        Object.entries(response.reflectionAnswers).forEach(([questionId, answer]) => {
            const key = `${questionId}:${answer}`
            accumulator[key] = (accumulator[key] ?? 0) + 1
        })
        return accumulator
    }, {})

    return Object.entries(grouped)
        .sort((left, right) => right[1] - left[1])
        .slice(0, 3)
        .map(([category, frequency]) => ({
            category: category.split(':')[0],
            summary: category.split(':')[1] ?? 'Jawaban refleksi',
            frequency,
        }))
}

export async function getFeedbackInsight(classId: string): Promise<FeedbackInsight> {
    const responses = await feedbackService.getFeedbackByClass(classId)
    const totalFeedback = responses.length

    const moodDistribution = Object.entries(
        responses.reduce<Record<string, number>>((accumulator, response) => {
            accumulator[response.selectedMood] = (accumulator[response.selectedMood] ?? 0) + 1
            return accumulator
        }, {}),
    )
        .map(([mood, count]) => ({
            mood: moodLabels[mood] ?? mood,
            count,
            percentage: totalFeedback > 0 ? Math.round((count / totalFeedback) * 100) : 0,
        }))
        .sort((left, right) => right.count - left.count)

    const commonStruggles = responses
        .flatMap((response) => Object.values(response.reflectionAnswers))
        .filter(Boolean)
        .slice(0, 4)

    return {
        classId,
        totalFeedback,
        moodDistribution,
        commonStruggles,
        reflectionSummary: summarizeReflection(responses),
        generatedAt: new Date().toISOString(),
    }
}
