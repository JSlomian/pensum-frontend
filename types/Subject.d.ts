declare global {

    type Subject = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        program: Program,
        subjectHours: SubjectHours[],
        subjectGroups: SubjectGroup[],
        subjectLecturers: SubjectLecturer[]
    }

    type SubjectCreate =
        Omit<Subject, 'id' | '@id' | '@type' | 'program' | 'subjectHours' | 'subjectGroups' | 'subjectLecturers'>
        & {
        program: string,
        subjectHours: string,
        subjectGroups: string,
        subjectLecturers: string
    }
}

export {}
