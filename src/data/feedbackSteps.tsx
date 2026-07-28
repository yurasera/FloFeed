import { JoinClassStep } from '../components/JoinClassStep'
import { MoodStep } from '../components/MoodStep'
import { ReflectionStep } from '../components/ReflectionStep'
import { ReviewStep } from '../components/ReviewStep'
import { WelcomeStep } from '../components/WelcomeStep'
import { SuccessStep } from '../components/SuccessStep'
import type { FeedbackStepDefinition } from '../types/feedback'

export const feedbackSteps: FeedbackStepDefinition[] = [
    {
        id: 'join-class',
        title: 'Join Class',
        render: (actions) => <JoinClassStep onNext={actions.onNext} />,
    },
    {
        id: 'welcome',
        title: 'Welcome',
        render: (actions) => <WelcomeStep onStart={actions.onNext} />,
    },
    {
        id: 'mood',
        title: 'Mood',
        render: (actions) => <MoodStep onPrevious={actions.onPrevious} onNext={actions.onNext} />,
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