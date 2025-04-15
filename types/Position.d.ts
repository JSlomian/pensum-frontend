declare global {

    type Position = {
        "@id": string,
        "@type": string,
        id: number,
        title: string,
        abbreviation: string,
        description: string,
        pensum: number | null
    }

    type PositionCreate = Omit<Position, 'id' | '@id' | '@type'>
}

export {}