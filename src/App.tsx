import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { FeedbackDataProvider } from './context/feedbackDataContext'
import { FeedbackFlowStateProvider } from './context/feedbackFlowState'
import { LearnerAuthProvider } from './context/learnerAuthContext'
import { FeedbackPage } from './pages/FeedbackPage'
import { HomePage } from './pages/HomePage'
import { DemoFeedbackPage } from './pages/DemoFeedbackPage'
import { LoginPage } from './pages/LoginPage'
import { MentorClassManagementPage } from './pages/MentorClassManagementPage'
import { MentorInsightDashboardPage } from './pages/MentorInsightDashboardPage'
import { RegisterPage } from './pages/RegisterPage'
import { FeedbackHistoryPage } from './pages/FeedbackHistoryPage'
import { RoomPage } from './pages/RoomPage'
import { RoomJoinPage } from './pages/RoomJoinPage'
import { RoomFeedbackPage } from './pages/RoomFeedbackPage'
import { Navbar } from './components/Navbar'

function AppRouter() {
    const location = useLocation()
    const hideNavbarPaths = ['/demo-feedback']

    return (
        <>
            {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/demo-feedback" element={<DemoFeedbackPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/mentor/classes" element={<MentorClassManagementPage />} />
                <Route path="/mentor/insights" element={<MentorInsightDashboardPage />} />
                <Route path="/room" element={<RoomPage />} />
                <Route path="/room/join" element={<RoomJoinPage />} />
                <Route path="/room/feedback" element={<RoomFeedbackPage />} />
                <Route path="/mentor" element={<Navigate to="/mentor/classes" replace />} />
                <Route path="/history" element={<FeedbackHistoryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default function App() {
    return (
        <LearnerAuthProvider>
            <FeedbackFlowStateProvider>
                <FeedbackDataProvider>
                    <HashRouter>
                        <AppRouter />
                    </HashRouter>
                </FeedbackDataProvider>
            </FeedbackFlowStateProvider>
        </LearnerAuthProvider>
    )
}
