declare global {

    type ClassType = {
        id: number,
        type: string,
        abbreviation: string
    }

    type ClassTypeCreate = Omit<ClassType, 'id'>
}

export {}