import { Navigate, useLocation } from 'react-router-dom'
import { FeedbackFlowScreen } from '../features/feedback/components/FeedbackFlowScreen'
import { useLearnerAuth } from '../context/learnerAuthContext'

export function DashboardPage() {
    const location = useLocation()
    const { isAuthenticated } = useLearnerAuth()

    if (!isAuthenticated) {
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
        return <Navigate to={`/login?redirect=${redirect}`} replace />
    }

    return <FeedbackFlowScreen />
}
