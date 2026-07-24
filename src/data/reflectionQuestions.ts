type ReflectionQuestion = {
    id: string
    label: string
}

const reflectionQuestionMap: Record<string, ReflectionQuestion[]> = {
    'very-happy': [
        { id: 'helpful', label: 'Apa yang paling membantu Anda hari ini?' },
        { id: 'keep', label: 'Apa yang sebaiknya dipertahankan mentor?' },
    ],
    happy: [
        { id: 'helpful', label: 'Apa yang paling membantu Anda hari ini?' },
        { id: 'keep', label: 'Apa yang sebaiknya dipertahankan mentor?' },
    ],
    neutral: [{ id: 'improve', label: 'Bagian mana yang menurut Anda masih bisa ditingkatkan?' }],
    confused: [
        { id: 'confusing', label: 'Bagian mana yang membuat Anda bingung atau kurang nyaman?' },
        { id: 'better', label: 'Apa yang dapat dilakukan mentor agar pembelajaran lebih baik?' },
    ],
    disappointed: [
        { id: 'confusing', label: 'Bagian mana yang membuat Anda bingung atau kurang nyaman?' },
        { id: 'better', label: 'Apa yang dapat dilakukan mentor agar pembelajaran lebih baik?' },
    ],
}

export function getReflectionQuestions(mood: string) {
    return reflectionQuestionMap[mood] ?? []
}