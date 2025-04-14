declare global {

    type Position = {
        id: number,
        title: string,
        abbreviation: string,
        description: string,
        pensum: number | null
    }

    type PositionCreate = Omit<Position, 'id'>
}

export {}