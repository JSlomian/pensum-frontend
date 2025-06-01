declare global {

    type ApiUser = {
        "@id": string,
        "@type": string,
        id: number,
        email: string
        roles: string[],
        position: Position
        last_name: string,
        first_name: string,
        institute: Institute,
        subjectLecturers?: SubjectLecturer[],
        hoursUsed?: number
    }
    type ApiUserCreate = Omit<ApiUser, 'id' | '@id' | '@type' | 'position' | 'institute'>
        & {
        position: string,
        institute: string,
    }
}

export {}
