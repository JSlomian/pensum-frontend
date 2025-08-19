declare global {

    type Institute = {
        "@id": string,
        "@type": string,
        id: number,
        name: string,
        abbreviation: string
    }

    type InstituteCreate = Omit<Institute, 'id' | '@id' | '@type'>
}

export {}


// import type { components } from '~/types/api';
//
// export type InstituteCreate = components['schemas']['Institutes-institutes.write'];
// export type Institute = components['schemas']['Institutes.jsonld-majors.read_institutes.read']