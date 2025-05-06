declare global {

    type SubjectGroup = {
        "@id": string,
        "@type": string,
        id: number,
        subject: Subject,
        classType: ClassType,
        amount: number
    }

    type SubjectGroupCreate = Omit<SubjectGroup, 'id' | '@id' | '@type' | 'subject' | 'classType'>
        & {
        subject: string,
        classType: string
    }
}

export {}
