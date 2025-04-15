declare global {

    type EducationLevel = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
    }

    type EducationLevelCreate = Omit<EducationLevel, 'id' | '@id' | '@type'>
}

export {}
