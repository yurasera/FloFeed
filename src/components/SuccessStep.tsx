import { PrimaryButton } from './PrimaryButton'
import { ConfettiDecoration } from './ConfettiDecoration'
import { IllustrationPlaceholder } from './IllustrationPlaceholder'

type SuccessStepProps = {
    onComplete: () => void
}

export function SuccessStep({ onComplete }: SuccessStepProps) {
    return (
        <article className="step-panel relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-8">
            <ConfettiDecoration />

            <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <section className="space-y-5 text-left">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-inset ring-emerald-100">
                        <span className="text-2xl" aria-hidden="true">
                            ✨
                        </span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Terima kasih!</h2>
                        <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                            <p>Feedback Anda berhasil dikirim secara anonim.</p>
                            <p>Masukan Anda akan membantu mentor meningkatkan kualitas pembelajaran.</p>
                        </div>
                    </div>

                    <PrimaryButton onClick={onComplete} className="min-w-36">
                        Selesai
                    </PrimaryButton>
                </section>

                <section aria-label="Success illustration">
                    <IllustrationPlaceholder />
                </section>
            </div>
        </article>
    )
}