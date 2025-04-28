declare global {

    type ProgramInMajor = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
    }

    type ProgramInMajorCreate = Omit<ProgramInMajor, 'id' | '@id' | '@type'>
}

export {}
