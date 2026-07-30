import { Link } from 'react-router-dom'
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

    return (
        <PageContainer className="py-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
                <Card className="relative overflow-hidden border-blue-100 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_#eff6ff_0%,_#ffffff_100%)]">
                    <div className="space-y-8">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-inset ring-blue-100">
                            <ShieldIcon />
                        </div>

                        <SectionTitle
                            eyebrow="FloFeed"
                            title="Login dulu, feedback tetap anonim"
                            description="Learner masuk ke sistem untuk menjaga accountability, tetapi mentor hanya melihat feedback anonim dan ringkasan agregat."
                        />

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Buat akun learner
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                                Masuk
                            </Link>
                            <Link
                                to="/feedback"
                                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                            >
                                Lanjut ke feedback
                            </Link>
                            {isAuthenticated ? (
                                <Link
                                    to="/history"
                                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                                >
                                    Riwayat feedback
                                </Link>
                            ) : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <FeatureCard
                                title="Accountability"
                                description="Session learner tersimpan agar kebiasaan feedback tetap konsisten dari kelas ke kelas."
                            />
                            <FeatureCard
                                title="Privacy"
                                description="Identitas learner tidak pernah ditampilkan di dashboard mentor atau payload feedback."
                            />
                            <FeatureCard
                                title="Auth-ready"
                                description="Lapisan service dan context sudah dipisah agar mudah pindah ke Supabase Auth."
                            />
                        </div>
                    </div>
                </Card>

                <Card className="space-y-6 border-slate-200 bg-white">
                    <SectionTitle
                        eyebrow="Current session"
                        title={isAuthenticated && learner ? `Halo, ${learner.name}` : 'Belum ada sesi aktif'}
                        description={
                            isAuthenticated && learner
                                ? 'Sesi learner tersimpan di perangkat ini dan siap dipakai untuk melanjutkan feedback anonim.'
                                : 'Silakan daftar atau login untuk menyimpan sesi dan melanjutkan ke flow feedback.'
                        }
                    />

                    {isAuthenticated && learner && session ? (
                        <div className="space-y-4">
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-sm font-semibold text-slate-900">{learner.email}</p>
                                <p className="mt-1 text-sm text-slate-600">Created {new Date(learner.createdAt).toLocaleString('id-ID')}</p>
                                <p className="mt-1 text-sm text-slate-600">
                                    Last active {new Date(session.lastActiveAt).toLocaleString('id-ID')}
                                </p>
                                <p className="mt-1 text-sm text-slate-600">{memberships.length} membership kelas tersimpan</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/feedback"
                                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Lanjut feedback
                                </Link>
                                <Link
                                    to="/history"
                                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                                >
                                    Riwayat
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => void logoutLearner()}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm leading-6 text-slate-600">
                                Layar ini menyiapkan akun learner untuk flow feedback, sementara mentor tetap melihat data anonim saja.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Register
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
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

                <Card className="space-y-4 bg-slate-950 text-white">
                    <SectionTitle
                        eyebrow="Mentor side"
                        title="Tetap anonim untuk mentor"
                        description="Authentication hanya dipakai untuk accountability learner. Mentor dashboard tetap membaca data anonim dan agregat."
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        <Link
                            to="/mentor/classes"
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Mentor classes
                            <p className="mt-2 text-sm font-normal text-slate-300">Kelola kelas dan siapkan ruang untuk feedback.</p>
                        </Link>
                        <Link
                            to="/mentor/insights"
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Mentor insights
                            <p className="mt-2 text-sm font-normal text-slate-300">Lihat ringkasan feedback anonim dan pola utama.</p>
                        </Link>
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
