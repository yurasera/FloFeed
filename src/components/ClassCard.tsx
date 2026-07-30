import { Card } from './Card'
import type { Class } from '../types/feedback'
import { useEffect, useState } from 'react'
import { completionService } from '../services/completionService'

type ClassCardProps = {
    classItem: Class
    mentorName?: string
}

export function ClassCard({ classItem, mentorName }: ClassCardProps) {
    const [roster, setRoster] = useState<{ learnerCount: number; completedCount: number; pendingCount: number } | null>(null)

    useEffect(() => {
        void completionService.getClassRoster(classItem.id).then(setRoster)
    }, [classItem.id])

    return (
        <Card className="space-y-4 p-5 shadow-none">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{classItem.isActive ? 'Active' : 'Inactive'}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{classItem.name}</h3>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {classItem.code}
                </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
                <p>Mentor: {mentorName ?? classItem.mentorId}</p>
                <p>Created: {new Date(classItem.createdAt).toLocaleDateString('id-ID')}</p>
                {roster && (
                    <div className="mt-2 text-sm">
                        <p>Learners: {roster.learnerCount}</p>
                        <p className="text-emerald-700">Completed: {roster.completedCount}</p>
                        <p className="text-amber-700">Pending: {roster.pendingCount}</p>
                    </div>
                )}
            </div>
        </Card>
    )
}
