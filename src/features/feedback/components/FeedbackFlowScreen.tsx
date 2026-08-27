import { useState } from 'react'
import { useLearnerAuth } from '../../../context/learnerAuthContext'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { RoomCodeInputCard } from '../../room/components/RoomCodeInputCard'
import { PrimaryButton } from '../../../components/ui/PrimaryButton'
import { useFeedbackFlowState } from '../../../context/feedbackFlowState'
import type { Class } from '../../../types/feedback'

function LearnerSessionBanner() {
    const { learner, session, memberships, logoutLearner, touchSession } = useLearnerAuth()

    if (!learner || !session) {
        return null
    }

    const lastActiveDate = new Date(session.lastActiveAt)

    return (
        <Card className="flex flex-col gap-4 border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Learner Session</p>
                <h2 className="text-lg font-semibold text-slate-900">
                    {learner.name} <span className="text-slate-500">· {learner.email}</span>
                </h2>
                <p className="text-sm text-slate-600">
                    Session tersimpan, last active {lastActiveDate.toLocaleString('id-ID')}, {memberships.length} class membership aktif/tersimpan.
                </p>
            </div>
        </Card>
    )
}

export function FeedbackFlowScreen() {
    const navigate = useNavigate()
    const { setSelectedClass } = useFeedbackFlowState()
    const [roomInfo, setRoomInfo] = useState<Class | null>(null)

    const handleRoomFound = (room: Class) => {
        setRoomInfo(room)
        setSelectedClass(room)
    }

    const handleReset = () => {
        setRoomInfo(null)
        setSelectedClass(null)
    }

    const handleProceed = () => {
        if (!roomInfo) {
            return
        }
        navigate('/room/feedback')
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <main className="space-y-6">
                <div className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
                    <div className="mx-auto w-full max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
                        <LearnerSessionBanner />
                        <div className="mt-6">
                            <RoomCodeInputCard
                                eyebrow="Room Join"
                                title="Masuk ke room dengan kode"
                                description="Masukkan roomCode untuk melihat informasi room dan lanjutkan ke feedback flow."
                                onRoomFound={handleRoomFound}
                                onReset={handleReset}
                                onBack={() => navigate('/')}
                            />

                            {roomInfo ? (
                                <div className="mt-6 space-y-4">
                                    <Card className="space-y-4 border-blue-100 bg-blue-50 p-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Room ditemukan</p>
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
                                        <PrimaryButton type="button" onClick={handleProceed} className="w-full">
                                            Lanjut ke feedback
                                        </PrimaryButton>
                                    </Card>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
