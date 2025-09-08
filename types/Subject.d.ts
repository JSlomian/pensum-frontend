declare global {

    type Subject = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        program: Program,
        subjectHours: (SubjectHours | SubjectHoursCreate)[],
        subjectGroups: (SubjectGroup | SubjectGroupCreate)[],
        subjectLecturers: (SubjectLecturer | SubjectLecturerCreate)[]
    }

    type SubjectCreate =
        Omit<Subject, 'id' | '@id' | '@type' | 'program' | 'subjectHours' | 'subjectGroups' | 'subjectLecturers'>
        & {
        program: string,
        subjectHours?: string,
        subjectGroups?: string,
        subjectLecturers?: string
    }
}

export {}
