import { mockClasses } from '../data/mockClasses'
import type { Class } from '../types/feedback'

export function findClassByCode(code: string): Class | null {
    const normalizedCode = code.trim().toUpperCase()

    return mockClasses.find((classItem) => classItem.code === normalizedCode) ?? null
}
