declare global {

    type ProgramInMajor = {
        "@id": string,
        "@type": string,
        id: number,
        major: Major,
        educationLevel: EducationLevel,
        attendanceMode: AttendanceMode
    }

    type ProgramInMajorCreate = Omit<ProgramInMajor, 'id' | '@id' | '@type' | 'major' | 'educationLevel'| 'attendanceMode'>
        & {
        major: string,
        educationLevel: string,
        attendanceMode: string
    }
}

export {}
