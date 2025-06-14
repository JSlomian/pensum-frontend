declare global {

    type SubjectLecturer = {
        "@id": string,
        "@type": string,
        id: number,
        subject: Subject,
        classType: ClassType,
        user: ApiUser,
        subjectHours: number
    }

    type SubjectLecturerCreate = Omit<SubjectLecturer, 'id' | '@id' | '@type' | 'subject' | 'classType' | 'user'>
        & {
        subject: string,
        classType: string,
        user: string,
        subjectHours: number
    }
}

export {}
