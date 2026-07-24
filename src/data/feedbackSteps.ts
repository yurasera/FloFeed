export type FeedbackStep = {
    id: string
    title: string
}

export const feedbackSteps: FeedbackStep[] = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'mood', title: 'Mood' },
    { id: 'reflection', title: 'Reflection' },
    { id: 'review', title: 'Review' },
    { id: 'success', title: 'Success' },
]