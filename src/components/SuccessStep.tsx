import { PrimaryButton } from './PrimaryButton'
import { ConfettiDecoration } from './ConfettiDecoration'
import { IllustrationPlaceholder } from './IllustrationPlaceholder'
import { StepSectionHeader } from './StepSectionHeader'
import { StepShell } from './StepShell'

type SuccessStepProps = {
    onComplete: () => void
}

export function SuccessStep({ onComplete }: SuccessStepProps) {
    return (
        <StepShell className="relative overflow-hidden">
            <ConfettiDecoration />

            <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <section className="space-y-5 text-left">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-inset ring-emerald-100">
                        <span className="text-2xl" aria-hidden="true">
                            ✨
                        </span>
                    </div>

                    <div className="space-y-3">
                        <StepSectionHeader eyebrow="Success" title="Terima kasih!" />
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
        </StepShell>
    )
}