declare global {

    type Institute = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
    }

    type InstituteCreate = Omit<Institute, 'id' | '@id' | '@type'>
}

export {}
