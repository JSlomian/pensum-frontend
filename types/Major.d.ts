declare global {

    type Major = {
        id: number,
        name: string,
        abbreviation: string
    }

   type MajorCreate = Omit<Major, 'id'>
}

export {}
