import type { ReactNode } from 'react'
import { WelcomeStep } from '../components/WelcomeStep'

export type FeedbackStep = {
    id: string
    title: string
    render?: (onNext: () => void) => ReactNode
}

export const feedbackSteps: FeedbackStep[] = [
    {
        id: 'welcome',
        title: 'Welcome',
        render: (onNext) => <WelcomeStep onStart={onNext} />,
    },
    { id: 'mood', title: 'Mood' },
    { id: 'reflection', title: 'Reflection' },
    { id: 'review', title: 'Review' },
    { id: 'success', title: 'Success' },
]