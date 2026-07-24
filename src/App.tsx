import { Card } from './components/Card'
import { PageContainer } from './components/PageContainer'
import { PrimaryButton } from './components/PrimaryButton'
import { ProgressBar } from './components/ProgressBar'
import { SecondaryButton } from './components/SecondaryButton'
import { SectionTitle } from './components/SectionTitle'
import { useAppReady } from './hooks/useAppReady'
import { FeedbackPage } from './pages/FeedbackPage'
import { HomePage } from './pages/HomePage'
import { SuccessPage } from './pages/SuccessPage'

export default function App() {
    useAppReady()

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <PageContainer className="py-8 sm:py-10">
                <Card className="space-y-8 bg-white">
                    <section className="space-y-4">
                        <SectionTitle
                            eyebrow="FloFeed"
                            title="Modern feedback flows, ready to be wired up"
                            description="A clean TypeScript + Tailwind foundation with reusable UI primitives and a mobile-first SaaS layout."
                        />
                        <div className="flex flex-wrap gap-3">
                            <PrimaryButton>Primary action</PrimaryButton>
                            <SecondaryButton>Secondary action</SecondaryButton>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>Setup progress</span>
                            <span>0%</span>
                        </div>
                        <ProgressBar value={0} />
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        <Card className="p-5">
                            <HomePage />
                        </Card>
                        <Card className="p-5">
                            <FeedbackPage />
                        </Card>
                        <Card className="p-5">
                            <SuccessPage />
                        </Card>
                    </section>
                </Card>
            </PageContainer>
        </main>
    )
}