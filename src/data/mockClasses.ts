import type { Class, Mentor } from '../types/feedback'

export const mockMentors: Mentor[] = [
    {
        id: 'mentor-1',
        name: 'Maya',
        email: 'maya@flofeed.test',
    },
    {
        id: 'mentor-2',
        name: 'Rizki',
        email: 'rizki@flofeed.test',
    },
]

export const mockClasses: Class[] = [
    {
        id: 'class-1',
        code: 'ALPHA01',
        name: 'Frontend Fundamentals',
        mentorId: 'mentor-1',
    },
    {
        id: 'class-2',
        code: 'BETA02',
        name: 'Product Design Basics',
        mentorId: 'mentor-2',
    },
]
