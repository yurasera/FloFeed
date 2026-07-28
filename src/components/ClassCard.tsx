import { Card } from './Card'
import type { Class } from '../types/feedback'

type ClassCardProps = {
    classItem: Class
    mentorName?: string
}

export function ClassCard({ classItem, mentorName }: ClassCardProps) {
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
            </div>
        </Card>
    )
}
