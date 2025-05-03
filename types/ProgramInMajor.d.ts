declare global {

    type ProgramInMajor = {
        "@id": string,
        "@type": string,
        id: number,
        major: Major | string,
        educationLevel: EducationLevel | string,
        attendanceMode: AttendanceMode | string
    }

    type ProgramInMajorCreate = Omit<ProgramInMajor, 'id' | '@id' | '@type'>
}

export {}
