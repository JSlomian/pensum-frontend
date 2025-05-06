declare global {

    type Subject = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        program: Program,
        subjectHours: SubjectHours | string,
        subjectGroups: SubjectGroups | string,
        subjectLecturers: SubjectLecturers | string
    }

    type SubjectCreate = Omit<Subject, 'id' | '@id' | '@type' | 'program' | 'subjectHours' | 'subjectGroups' | 'subjectLecturers'>
    & {
        program: string
    }
}

export {}
