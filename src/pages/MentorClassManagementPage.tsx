import { useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { ClassCard } from '../components/ClassCard'
import { CreateClassForm } from '../components/CreateClassForm'
import { PageContainer } from '../components/PageContainer'
import { SectionTitle } from '../components/SectionTitle'
import { mockClasses, mockMentors } from '../data/mockClasses'
import { createClassRecord } from '../services/classManagementService'
import type { Class, ClassCreationForm } from '../types/feedback'

const defaultMentorId = mockMentors[0]?.id ?? ''

export function MentorClassManagementPage() {
    const [classes, setClasses] = useState<Class[]>(mockClasses)
    const [showForm, setShowForm] = useState(false)

    const mentorClasses = useMemo(() => {
        return classes.filter((classItem) => classItem.mentorId === defaultMentorId)
    }, [classes])

    const handleCreateClass = (form: ClassCreationForm) => {
        const newClass = createClassRecord(form, classes)
        setClasses((currentClasses) => [newClass, ...currentClasses])
        setShowForm(false)
    }

    return (
        <PageContainer className="py-10">
            <Card className="space-y-8 bg-white">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionTitle
                        eyebrow="Mentor Dashboard"
                        title="Kelola kelas Anda"
                        description="Buat kelas baru, generate kode kelas, dan siapkan kelas untuk menerima feedback anonim."
                    />
                    <button
                        type="button"
                        onClick={() => setShowForm((currentValue) => !currentValue)}
                        className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition hover:bg-blue-500"
                    >
                        {showForm ? 'Tutup form' : 'Buat kelas baru'}
                    </button>
                </section>

                {showForm ? (
                    <CreateClassForm mentors={mockMentors} onSubmit={handleCreateClass} onCancel={() => setShowForm(false)} />
                ) : null}

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">Kelas aktif</h3>
                        <span className="text-sm text-slate-500">{mentorClasses.length} kelas</span>
                    </div>

                    {mentorClasses.length > 0 ? (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {mentorClasses.map((classItem) => (
                                <ClassCard
                                    key={classItem.id}
                                    classItem={classItem}
                                    mentorName={mockMentors.find((mentor) => mentor.id === classItem.mentorId)?.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center text-slate-600 shadow-none">
                            Belum ada kelas yang dibuat. Mulai dengan membuat kelas baru.
                        </Card>
                    )}
                </section>
            </Card>
        </PageContainer>
    )
}
