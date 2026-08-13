import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { SectionTitle } from '../components/SectionTitle'
import { RoomCodeInputCard } from '../features/room/components/RoomCodeInputCard'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { useFeedbackFlowState } from '../context/feedbackFlowState'
import { useFeedbackData } from '../context/feedbackDataContext'
import { useLearnerAuth } from '../context/learnerAuthContext'
import { roomService } from '../services/roomService'
import type { Class } from '../types/feedback'

export function RoomJoinPage() {
    const navigate = useNavigate()
    const { setSelectedClass } = useFeedbackFlowState()
    const [roomInfo, setRoomInfo] = useState<Class | null>(null)
    const { feedbackResponses } = useFeedbackData()
    const { learner } = useLearnerAuth()
    const [roomsWithFeedback, setRoomsWithFeedback] = useState<Array<{ id: number; name: string; code?: string }>>([])

    const handleProceed = () => {
        if (!roomInfo) {
            return
        }

        navigate('/room/feedback')
    }

    const selectedRoomAlreadyFilled = roomInfo
        ? feedbackResponses.some((r) => r.roomId == roomInfo.id && r.memberId && learner?.id && r.memberId === learner.id)
        : false

    useEffect(() => {
        let mounted = true

        const loadRooms = async () => {
            try {
                const uniqueRoomIds = Array.from(
                    new Set(
                        feedbackResponses
                            .filter((r) => r.memberId && learner?.id && r.memberId === learner.id)
                            .map((r) => r.roomId),
                    ),
                )
                const fetched: Array<{ id: number; name: string; code?: string }> = []
                await Promise.all(
                    uniqueRoomIds.map(async (roomId) => {
                        try {
                            const room = await roomService.getRoomById(roomId)
                            if (room) {
                                fetched.push({ id: room.id, name: room.roomName, code: room.roomCode })
                            }
                        } catch (e) {
                            // ignore individual lookup errors
                        }
                    }),
                )

                if (mounted) {
                    setRoomsWithFeedback(fetched)
                }
            } catch (e) {
                // ignore
            }
        }

        void loadRooms()

        return () => {
            mounted = false
        }
    }, [feedbackResponses, learner?.id])

    return (
        <PageContainer className="py-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <Card className="space-y-8 bg-white">
                    <RoomCodeInputCard
                        eyebrow="Room Join"
                        title="Masuk ke room dengan kode"
                        description="Masukkan roomCode untuk melihat informasi room dan lanjutkan ke feedback flow."
                        onRoomFound={(mappedClass) => {
                            setRoomInfo(mappedClass)
                            setSelectedClass(mappedClass)
                        }}
                        onReset={() => {
                            setRoomInfo(null)
                            setSelectedClass(null)
                        }}
                        onBack={() => navigate('/')}
                    />

                    {roomInfo ? (
                        <Card className="space-y-4 border-blue-100 bg-blue-50 p-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Room ditemukan</p>
                                {selectedRoomAlreadyFilled ? (
                                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Sudah diisi</div>
                                ) : null}
                            </div>
                            <div className="space-y-3 text-sm text-slate-700">
                                <div>
                                    <p className="font-semibold">Nama Room</p>
                                    <p>{roomInfo.name}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Kode Room</p>
                                    <p>{roomInfo.code}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Master ID</p>
                                    <p>{roomInfo.mentorId}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Dibuat pada</p>
                                    <p>{new Date(roomInfo.createdAt).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                            <PrimaryButton type="button" onClick={handleProceed} className="w-full" disabled={selectedRoomAlreadyFilled}>
                                {selectedRoomAlreadyFilled ? 'Sudah diisi' : 'Lanjut ke feedback'}
                            </PrimaryButton>
                        </Card>
                    ) : null}
                </Card>

                <Card className="space-y-6 bg-white">
                    <SectionTitle
                        eyebrow="Room Info"
                        title="Gunakan roomCode untuk mengakses room"
                        description="Room code adalah cara cepat bagi anggota untuk bergabung ke room yang sudah dibuat oleh master."
                    />
                    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                        <p>Masukkan kode room yang valid di atas lalu klik <strong>Cari Room</strong>.</p>
                        <p>Jika room tersedia, informasi room akan muncul dan Anda bisa melanjutkan ke alur feedback.</p>
                        <p>Room code biasanya tampil di halaman room master setelah room dibuat.</p>

                        {roomsWithFeedback.length > 0 ? (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-slate-700">Rooms dengan feedback</p>
                                <ul className="mt-2 space-y-3 text-sm text-slate-700">
                                    {roomsWithFeedback.map((r) => (
                                        <li key={r.id} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="font-medium text-slate-800">{r.name}</span>
                                                {r.code ? <span className="text-slate-500">{r.code}</span> : null}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </Card>
            </div>
        </PageContainer>
    )
}
