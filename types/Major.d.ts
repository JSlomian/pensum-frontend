declare global {

    type Major = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
        institute: Institute | null | string
    }

    type MajorCreate = Omit<Major, 'id' | '@id' | '@type'>
}

export {}
