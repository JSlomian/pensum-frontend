declare global {

    type Program = {
        "@id": string,
        "@type": string,
        id: number,
        planYear: number,
        semester: number,
        programInMajors: ProgramInMajor,
        subject: Subject[]
    }

    type ProgramCreate = Omit<Program, 'id' | '@id' | '@type' | 'subject' | 'programInMajors'>
    & {
        programInMajors: string,
    }
}

export {}
