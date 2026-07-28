import { useMemo, useState } from 'react'
import { PrimaryButton } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { StepSectionHeader } from './StepSectionHeader'
import { StepShell } from './StepShell'
import { ClassCodeInput } from './ClassCodeInput'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { findClassByCode } from '../services/classService'

type JoinClassStepProps = {
    onNext: () => void
}

export function JoinClassStep({ onNext }: JoinClassStepProps) {
    const { selectedClass, setSelectedClass } = useFeedbackFlowState()
    const [code, setCode] = useState(selectedClass?.code ?? '')
    const [error, setError] = useState('')

    const matchedClass = useMemo(() => {
        return findClassByCode(code)
    }, [code])

    const handleContinue = () => {
        if (!matchedClass) {
            setError('Kode kelas tidak ditemukan. Coba lagi.')
            setSelectedClass(null)
            return
        }

        setError('')
        setSelectedClass(matchedClass)
        onNext()
    }

    return (
        <StepShell>
            <div className="space-y-6 text-left">
                <StepSectionHeader eyebrow="Class Connection" title="Masuk ke kelas Anda" />
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                    Masukkan kode kelas untuk mengaitkan feedback Anda dengan kelas yang benar di masa depan.
                </p>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <ClassCodeInput value={code} onChange={setCode} error={error} />

                    {matchedClass ? (
                        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            <p className="font-semibold">Kelas ditemukan</p>
                            <p className="mt-1">{matchedClass.name}</p>
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <SecondaryButton onClick={onNext} className="sm:min-w-40">
                        Lewati
                    </SecondaryButton>
                    <PrimaryButton onClick={handleContinue} className="sm:min-w-40">
                        Lanjutkan
                    </PrimaryButton>
                </div>
            </div>
        </StepShell>
    )
}
