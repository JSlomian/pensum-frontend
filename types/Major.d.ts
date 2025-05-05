declare global {

    type Major = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
        institute: Institute
        // programInMajor: ProgramInMajor | undefined
    }

    type MajorCreate = Omit<Major, 'id' | '@id' | '@type' | 'institute'>
    & {
        institute: string
    }
}

export {}
