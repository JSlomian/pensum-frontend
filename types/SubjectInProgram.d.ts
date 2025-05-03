declare global {

    type SubjectInProgram = {
        "@id": string,
        "@type": string,
        id: number,
        planYear: Date,
        semester: number,
        programsInMajors: ProgramInMajor[],
        subjectInPrograms: SubjectInProgram[]
    }

    type SubjectInProgramsCreate = Omit<SubjectInProgram, 'id' | '@id' | '@type' | 'programsInMajors'>
        & {
        programInMajor: ProgramInMajor | string
    }
}

export {}
