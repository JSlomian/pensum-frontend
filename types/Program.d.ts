declare global {

    type Program = {
        "@id": string,
        "@type": string,
        id: number,
        planYear: Date,
        semester: number,
        programsInMajors: ProgramInMajor[],
        subjectsInPrograms: SubjectInPrograms[]
    }

    type ProgramCreate = Omit<Program, 'id' | '@id' | '@type' | 'programsInMajors' | 'subjectsInPrograms'>
}

export {}
