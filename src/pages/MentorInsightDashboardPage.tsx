import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { InsightCard } from '../components/InsightCard'
import { MoodChart } from '../components/MoodChart'
import { ReflectionSummaryCard } from '../components/ReflectionSummaryCard'
import { StruggleList } from '../components/StruggleList'
import { PageContainer } from '../components/PageContainer'
import { SectionTitle } from '../components/SectionTitle'
import { mockClasses, mockMentors } from '../data/mockClasses'
import { getFeedbackInsight } from '../services/insightService'
import { useFeedbackData } from '../context/feedbackDataContext'
import type { FeedbackInsight } from '../types/insights'

export function MentorInsightDashboardPage() {
    const { feedbackResponses, refreshFeedback } = useFeedbackData()
    const [selectedClassId, setSelectedClassId] = useState(mockClasses[0]?.id ?? '')
    const [insight, setInsight] = useState<FeedbackInsight | null>(null)

    useEffect(() => {
        if (!selectedClassId) {
            return
        }

        void getFeedbackInsight(selectedClassId).then(setInsight)
    }, [selectedClassId, feedbackResponses])

    useEffect(() => {
        void refreshFeedback()
    }, [refreshFeedback])

    const selectedClass = useMemo(() => mockClasses.find((classItem) => classItem.id === selectedClassId) ?? null, [selectedClassId])

    return (
        <PageContainer className="py-10">
            <Card className="space-y-8 bg-white">
                <section className="space-y-4">
                    <SectionTitle
                        eyebrow="Mentor Insights"
                        title="Dashboard insight feedback"
                        description="Lihat pola mood, struggle umum, dan ringkasan refleksi dari feedback anonim yang diterima kelas Anda."
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="class-select">
                            Pilih kelas
                        </label>
                        <select
                            id="class-select"
                            value={selectedClassId}
                            onChange={(event) => setSelectedClassId(event.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:max-w-sm"
                        >
                            {mockClasses.map((classItem) => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.name} · {mockMentors.find((mentor) => mentor.id === classItem.mentorId)?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {insight ? (
                    <div className="space-y-6">
                        <div className="grid gap-4 lg:grid-cols-3">
                            <InsightCard title="Total Feedback" value={insight.totalFeedback} description={selectedClass?.name ?? 'Kelas'} />
                            <InsightCard title="Mood Dominan" value={insight.moodDistribution[0]?.mood ?? 'Belum ada'} description="Pola suasana belajar" />
                            <InsightCard title="Generated" value={new Date(insight.generatedAt).toLocaleDateString('id-ID')} description="Tanggal insight" />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <MoodChart data={insight.moodDistribution} />
                            <StruggleList items={insight.commonStruggles} />
                        </div>

                        <ReflectionSummaryCard items={insight.reflectionSummary} />
                    </div>
                ) : (
                    <Card className="p-8 text-center text-slate-600 shadow-none">
                        Memuat insight feedback...
                    </Card>
                )}
            </Card>
        </PageContainer>
    )
}
