declare global {

    type SubjectHours = {
        "@id": string,
        "@type": string,
        id: number,
        subject: Subject,
        classType: ClassType,
        hoursRequired: number
    }

    type SubjectHoursCreate = Omit<SubjectHours, 'id' | '@id' | '@type' | 'subject' | 'classType'>
        & {
        subject: string,
        classType: string,
    }
}

export {}
