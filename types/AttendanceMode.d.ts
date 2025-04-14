declare global {

    type AttendanceMode = {
        id: number,
        name: string,
        abbreviation: string
    }

   type AttendanceModeCreate = Omit<AttendanceMode, 'id'>
}

export {}
