import { useMemo } from 'react'
import { getReflectionQuestions } from '../data/reflectionQuestions'

export function useReflectionQuestions(selectedMood: string) {
    return useMemo(() => getReflectionQuestions(selectedMood), [selectedMood])
}