import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FeedbackDataProvider } from './context/feedbackDataContext'
import { FeedbackFlowStateProvider } from './context/feedbackFlowState'
import { LearnerAuthProvider } from './context/learnerAuthContext'
import { FeedbackPage } from './pages/FeedbackPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MentorClassManagementPage } from './pages/MentorClassManagementPage'
import { MentorInsightDashboardPage } from './pages/MentorInsightDashboardPage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
    return (
        <LearnerAuthProvider>
            <FeedbackFlowStateProvider>
                <FeedbackDataProvider>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/feedback" element={<FeedbackPage />} />
                            <Route path="/mentor/classes" element={<MentorClassManagementPage />} />
                            <Route path="/mentor/insights" element={<MentorInsightDashboardPage />} />
                            <Route path="/mentor" element={<Navigate to="/mentor/classes" replace />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </HashRouter>
                </FeedbackDataProvider>
            </FeedbackFlowStateProvider>
        </LearnerAuthProvider>
    )

}
