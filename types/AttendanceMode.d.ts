declare global {

    type AttendanceMode = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
    }

    type AttendanceModeCreate = Omit<AttendanceMode, 'id' | '@id' | '@type'>
}

export {}
