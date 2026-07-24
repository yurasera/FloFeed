import type { ReactNode } from 'react'
import { MoodStep } from '../components/MoodStep'
import { ReflectionStep } from '../components/ReflectionStep'
import { ReviewStep } from '../components/ReviewStep'
import { WelcomeStep } from '../components/WelcomeStep'
import { SuccessStep } from '../components/SuccessStep'

export type FeedbackStep = {
    id: string
    title: string
    render?: (actions: {
        onNext: () => void
        onPrevious: () => void
        onComplete: () => void
    }) => ReactNode
}

export const feedbackSteps: FeedbackStep[] = [
    {
        id: 'welcome',
        title: 'Welcome',
        render: (actions) => <WelcomeStep onStart={actions.onNext} />,
    },
    {
        id: 'mood',
        title: 'Mood',
        render: (actions) => <MoodStep onNext={actions.onNext} />,
    },
    {
        id: 'reflection',
        title: 'Reflection',
        render: (actions) => <ReflectionStep onPrevious={actions.onPrevious} onNext={actions.onNext} />,
    },
    {
        id: 'review',
        title: 'Review',
        render: (actions) => <ReviewStep onPrevious={actions.onPrevious} onNext={actions.onNext} />,
    },
    { id: 'success', title: 'Success', render: (actions) => <SuccessStep onComplete={actions.onComplete} /> },
]