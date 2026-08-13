import { useState } from 'react'
import { Card } from './ui/Card'
import { SectionTitle } from './SectionTitle'
import { PrimaryButton } from './ui/PrimaryButton'
import { SecondaryButton } from './ui/SecondaryButton'
import { ClassCodeInput } from './ClassCodeInput'
import { roomService } from '../services/roomService'
import type { Class } from '../types/feedback'

type RoomCodeInputCardProps = {
    eyebrow: string
    title: string
    description: string
    onRoomFound: (room: Class) => void
    onReset: () => void
    onBack: () => void
    label?: string
    placeholder?: string
    buttonText?: string
    buttonLoadingText?: string
}

export function RoomCodeInputCard({
    eyebrow,
    title,
    description,
    onRoomFound,
    onReset,
    onBack,
    label = 'Kode Room',
    placeholder = 'Contoh: ABC123',
    buttonText = 'Cari Room',
    buttonLoadingText = 'Memeriksa...',
}: RoomCodeInputCardProps) {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [isChecking, setIsChecking] = useState(false)

    const handleCodeChange = (newCode: string) => {
        setCode(newCode)
        setError('')
        onReset()
    }

    const handleSearch = async () => {
        if (!code.trim()) {
            setError('Kode room wajib diisi.')
            onReset()
            return
        }

        setIsChecking(true)
        setError('')

        try {
            const room = await roomService.getRoomByCode(code)

            if (!room) {
                setError('Kode room tidak ditemukan. Coba lagi.')
                onReset()
                return
            }

            const mappedClass: Class = {
                id: room.id,
                code: room.roomCode,
                name: room.roomName,
                mentorId: room.masterId,
                createdAt: room.createdAt,
                isActive: true,
            }

            onRoomFound(mappedClass)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memeriksa room.')
            onReset()
        } finally {
            setIsChecking(false)
        }
    }

    return (
        <Card className="space-y-8 bg-white">
            <SectionTitle eyebrow={eyebrow} title={title} description={description} />

            <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <ClassCodeInput
                    value={code}
                    onChange={handleCodeChange}
                    error={error}
                    label={label}
                    placeholder={placeholder}
                    disabled={isChecking}
                />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                    <SecondaryButton type="button" onClick={onBack} className="sm:min-w-40">
                        Kembali
                    </SecondaryButton>
                    <PrimaryButton type="button" onClick={handleSearch} className="sm:min-w-40" disabled={isChecking}>
                        {isChecking ? buttonLoadingText : buttonText}
                    </PrimaryButton>
                </div>
            </div>
        </Card>
    )
}
