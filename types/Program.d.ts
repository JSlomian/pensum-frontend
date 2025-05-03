declare global {

    type Program = {
        "@id": string,
        "@type": string,
        id: number,
        planYear: Date,
        semester: number,
        programsInMajors: ProgramInMajor[] | string,
        subjectsInPrograms: SubjectInProgram[]
    }

    type ProgramCreate = Omit<Program, 'id' | '@id' | '@type' | 'subjectsInPrograms'>
}

export {}
