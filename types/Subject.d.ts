declare global {

    type Subject = {
        "@id": string,
        "@type": string,
        id: number,
        subjectsInPrograms: SubjectInProgram | string,
        subjectHours: SubjectHours | string,
        subjectGroups: SubjectGroups | string,
        subjectLecturers: SubjectLecturers | string
    }

    type SubjectCreate = Omit<Subject, 'id' | '@id' | '@type' | 'programsInMajors'>
}

export {}
