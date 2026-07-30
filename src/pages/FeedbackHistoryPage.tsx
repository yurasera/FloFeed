import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { EmptyHistoryState } from '../components/EmptyHistoryState'
import { HistoryList } from '../components/HistoryList'
import { PageContainer } from '../components/PageContainer'
import { ProgressSummaryCard } from '../components/ProgressSummaryCard'
import { SectionTitle } from '../components/SectionTitle'
import { useLearnerAuth } from '../context/learnerAuthContext'
import { useFeedbackHistory } from '../hooks/useFeedbackHistory'

export function FeedbackHistoryPage() {
    const { learner, isAuthenticated } = useLearnerAuth()
    const { history, progress, loading } = useFeedbackHistory(learner?.id)

    if (!isAuthenticated || !learner) {
        return (
            <PageContainer className="py-10">
                <Card className="space-y-4 p-8 text-center">
                    <p className="text-lg font-semibold text-slate-900">Login diperlukan</p>
                    <p className="text-sm text-slate-600">
                        Silakan login terlebih dahulu untuk melihat riwayat feedback Anda.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Login
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            Home
                        </Link>
                    </div>
                </Card>
            </PageContainer>
        )
    }

    return (
        <PageContainer className="py-10">
            <Card className="space-y-8 bg-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionTitle
                        eyebrow="Feedback History"
                        title="Riwayat feedback Anda"
                        description="Lihat semua feedback yang telah Anda kirim, beserta poin dan progress Anda."
                    />
                    <Link
                        to="/feedback"
                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-500"
                    >
                        Kirim feedback
                    </Link>
                </div>

                {loading ? (
                    <Card className="p-8 text-center text-slate-600 shadow-none">
                        Memuat riwayat feedback...
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {progress && <ProgressSummaryCard progress={progress} />}

                        {history.length > 0 ? (
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Semua feedback
                                    <span className="ml-2 text-sm font-normal text-slate-500">
                                        {history.length} entri
                                    </span>
                                </h3>
                                <HistoryList entries={history} />
                            </section>
                        ) : (
                            <EmptyHistoryState />
                        )}
                    </div>
                )}
            </Card>
        </PageContainer>
    )
}
