import { useState } from 'react'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'
import { SecondaryButton } from '../../../components/ui/SecondaryButton'
import { StepSectionHeader } from '../../../components/flow/StepSectionHeader'
import { StepShell } from '../../../components/flow/StepShell'
import { ClassCodeInput } from '../../../components/ClassCodeInput'
import { useFeedbackFlowState } from '../../../context/feedbackFlowState'
import { roomService } from '../../../services/roomService'
import type { Class } from '../../../types/feedback'

type JoinClassStepProps = {
    onNext: () => void
}

export function JoinClassStep({ onNext }: JoinClassStepProps) {
    const { setSelectedClass } = useFeedbackFlowState()
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [matchedRoomName, setMatchedRoomName] = useState<string | null>(null)
    const [isChecking, setIsChecking] = useState(false)

    const handleCodeChange = (newCode: string) => {
        setCode(newCode)
        if (error) {
            setError('')
        }
        if (matchedRoomName) {
            setMatchedRoomName(null)
        }
    }

    const handleContinue = async () => {
        if (!code.trim()) {
            setError('Kode room wajib diisi.')
            setSelectedClass(null)
            return
        }

        setIsChecking(true)
        setError('')

        try {
            const room = await roomService.getRoomByCode(code)

            if (!room) {
                setError('Kode room tidak ditemukan. Coba lagi.')
                setMatchedRoomName(null)
                setSelectedClass(null)
                return
            }

            setMatchedRoomName(room.roomName)
            const mappedClass: Class = {
                id: room.id,
                code: room.roomCode,
                name: room.roomName,
                mentorId: room.masterId,
                createdAt: room.createdAt,
                isActive: true,
            }

            setSelectedClass(mappedClass)
            onNext()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memeriksa room.')
            setSelectedClass(null)
            setMatchedRoomName(null)
        } finally {
            setIsChecking(false)
        }
    }

    return (
        <StepShell>
            <div className="space-y-6 text-left">
                <StepSectionHeader eyebrow="Class Connection" title="Masuk ke kelas Anda" />
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                    Masukkan kode kelas untuk mengaitkan feedback Anda dengan kelas yang benar di masa depan.
                </p>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <ClassCodeInput
                        value={code}
                        onChange={handleCodeChange}
                        error={error}
                        label="Kode Room"
                        placeholder="Contoh: 87WXC2"
                        disabled={isChecking}
                    />

                    {matchedRoomName ? (
                        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            <p className="font-semibold">Room ditemukan</p>
                            <p className="mt-1">{matchedRoomName}</p>
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
