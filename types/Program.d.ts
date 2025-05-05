declare global {

    type Program = {
        "@id": string,
        "@type": string,
        id: number,
        planYear: number,
        semester: number,
        programInMajors: ProgramInMajor,
        subjectsInPrograms: SubjectInProgram[]
    }

    type ProgramCreate = Omit<Program, 'id' | '@id' | '@type' | 'subjectsInPrograms' | 'programInMajors'>
    & {
        programInMajors: string
    }
}

export {}
