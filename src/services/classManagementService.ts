import type { Class, ClassCreationForm } from '../types/feedback'

function generateCode(existingCodes: string[]): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const prefix = 'CLS'

    for (let attempt = 0; attempt < 50; attempt += 1) {
        const randomPart = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
        const code = `${prefix}${randomPart}`

        if (!existingCodes.includes(code)) {
            return code
        }
    }

    return `${prefix}${Date.now().toString().slice(-4)}`
}

export function createClassRecord(form: ClassCreationForm, existingClasses: Class[] = []): Class {
    const trimmedName = form.name.trim()
    const code = generateCode(existingClasses.map((classItem) => classItem.code))

    return {
        id: `class-${Date.now()}`,
        code,
        name: trimmedName,
        mentorId: form.mentorId,
        createdAt: new Date().toISOString(),
        isActive: true,
    }
}
