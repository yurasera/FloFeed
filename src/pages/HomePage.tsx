import { Link, Navigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { PageContainer } from '../components/PageContainer'
import { SectionTitle } from '../components/SectionTitle'
import { ShieldIcon } from '../components/ShieldIcon'
import { useLearnerAuth } from '../context/learnerAuthContext'

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
    )
}

export function HomePage() {
    const { learner, session, memberships, isAuthenticated, logoutLearner } = useLearnerAuth()

    if (isAuthenticated) {
        return <Navigate to="/feedback" replace />
    }

    return (
        <PageContainer className="py-8 sm:py-10">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 px-6 py-5 shadow-sm shadow-slate-200/20">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">FloFeed</p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Selamat datang di FloFeed</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Mulai dengan login untuk mengelola feedback anonim.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="space-y-4 bg-white">
                    <SectionTitle
                        eyebrow="How it works"
                        title="Alur learner"
                        description="Register atau login, pertahankan session, lalu lanjut ke feedback flow tanpa mengungkap identitas ke mentor."
                    />

                    <ol className="space-y-3 text-sm leading-6 text-slate-600">
                        <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            1. Buat akun learner atau masuk dengan akun yang sudah tersimpan.
                        </li>
                        <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            2. Session tetap tersimpan di perangkat sehingga learner bisa kembali kapan saja.
                        </li>
                        <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            3. Kirim feedback anonim ke mentor tanpa membawa identitas learner.
                        </li>
                    </ol>
                </Card>
            </div>
        </PageContainer>
    )
}
