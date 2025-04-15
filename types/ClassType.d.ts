declare global {

    type ClassType = {
        "@id": string,
        "@type": string,
        id: number,
        type: string,
        abbreviation: string
    }

    type ClassTypeCreate = Omit<ClassType, 'id' | '@id' | '@type'>
}

export {}