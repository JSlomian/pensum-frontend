<script setup lang="ts">
  const routeString = useRoute()
  const router = useRouter()
  const id = routeString.params.id
  const usrRoute = `/api/users/${id}`
  const usrsRoute = `/api/users`
  const ctRoute = `/api/class_types`
  const { data: userData } = await useFetch<ApiUser>(usrRoute)
  const { data: usersData } = await useFetch<{ member: ApiUser[] }>(usrsRoute)
  const { data: classTypes } = await useFetch<{ member: ClassType[] }>(ctRoute)
  const subjects: Subject[] | undefined = userData.value?.subjectLecturers
    ?.map((subjectLecturer) => subjectLecturer.subject)
    .filter((subject, index, self) => index === self.findIndex((s) => s['@id'] === subject['@id']))

  const programIds: Program[] | undefined = subjects.value?.member.map((prog) => prog.program)
  const programsRoute = `/api/programs?id=${programIds?.join(',')}`
  const { data: programs } = await useFetch<{ member: Program[] }>(programsRoute)

  useHead(
    computed(() => {
      if (userData.value) {
        return {
          title: `Raport ${userData.value?.first_name} ${userData.value?.last_name}`,
        }
      } else {
        return {
          title: `Raport`,
        }
      }
    })
  )
  const { getSession } = useAuth()
  const user = await getSession()

  const isAdmin = user && user.roles.includes('ROLE_ADMIN')

  const getHoursRatio = (subject: subject, ct: ClassType): number | '\u00A0' => {
    const sl = userData.value.subjectLecturers.find(
      (s) =>
        typeof s === 'object' &&
        s.classType['@id'] === ct['@id'] &&
        subject['@id'] === s.subject['@id']
    )
    if (sl === undefined) {
      return '\u00A0'
    }
    const hours = sl.subjectHours
    const required =
      sl.subject.subjectHours?.find((sh) => sh.classType['@id'] === ct['@id'])?.hoursRequired ?? NaN
    const val = hours / required

    return isNaN(val) || !isFinite(val) ? '\u00A0' : val
  }

  const getSpecialityShortcut = (subjectIri: string): string => {
    const prog = programs.value?.member.find((prog) => prog.subject?.includes(subjectIri))
    if (prog === undefined) {
      return ''
    }
    return (
      prog.programInMajors.major?.abbreviation +
      '-' +
      prog.programInMajors.educationLevel.abbreviation +
      '-' +
      prog.programInMajors.attendanceMode.abbreviation
    )
  }

  const sumGroups = (subject: Subject): number => {
    return classTypes.value.member.reduce((sum: number, ct: classType) => {
      const groupRatio = getHoursRatio(subject, ct)
      return sum + (typeof groupRatio === 'number' ? groupRatio : 0)
    }, 0)
  }
  const sumHours = (subject: Subject): number => {
    const sls = userData.value.subjectLecturers.filter((sl) => sl.subject['@id'] === subject['@id'])
    return sls.reduce((sum: number, l: subjectLecturers) => {
      return sum + (typeof l.subjectHours === 'number' ? l.subjectHours : 0)
    }, 0)
  }
</script>
<template>
  <div class="container relative mx-auto overflow-x-auto p-6 shadow-md sm:rounded-lg">
    <div class="group relative z-0 mb-5 w-full">
      <label for="underline_select" class="sr-only">Wybierz program na kierunku</label>
      <select
        id="underline_select"
        required
        class="peer block w-full appearance-none border-0 border-b-2 border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-500 focus:border-gray-200 focus:outline-none focus:ring-0 dark:border-gray-700 dark:text-gray-400"
        @change="async (e) => await router.push(`/raport/${e.target.value}`)"
      >
        <template v-if="usersData?.member && usersData?.member?.length > 0">
          <option
            v-for="usr in usersData?.member as ApiUser[]"
            :key="usr['@id']"
            :value="usr['id']"
            :selected="parseInt(id) == usr['id']"
          >
            {{ usr.first_name }} {{ usr.last_name }}
          </option>
        </template>
      </select>
    </div>
    <div v-if="userData" class="grid grid-cols-2">
      <dl
        class="max-w-md divide-y divide-gray-200 text-gray-900 dark:divide-gray-700 dark:text-white"
      >
        <div class="flex flex-col pb-3">
          <dt class="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">Wykładowca</dt>
          <dd class="text-lg font-semibold">
            {{ userData.position.abbreviation ?? '' }} {{ userData.first_name }}
            {{ userData.last_name }}
          </dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">Stanowisko</dt>
          <dd class="text-lg font-semibold">{{ userData.position.description ?? 0 }}</dd>
        </div>
        <div class="flex flex-col pt-3">
          <dt class="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">Pensum</dt>
          <dd class="text-lg font-semibold">{{ userData.position.pensum ?? 0 }}</dd>
        </div>
        <div class="flex flex-col pt-3">
          <dt class="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">Zakład</dt>
          <dd class="text-lg font-semibold">{{ userData.institute.name ?? '' }}</dd>
        </div>
      </dl>
      <div></div>
      <div class="col-span-2 mt-5">
        <AlertDanger
          title=""
          message="Suma godzin podzielona przez ilość grup daje ilość godzin przypadającą na jedną grupę."
        />
        <AlertDanger
          title=""
          message="Jeżeli ilość grup jest liczbą niecałkowitą, to prowadzący realizuje z grupą tylko część zajęć."
        />
        <AlertDanger
          title=""
          message="Jeżeli ilość grup jest polem pustym to oznacza, iż nastąpił błąd przydziału formy zajęć."
        />
        <!--        <AlertWarning title="" message="PRZEDMIOTY PROWADZONE W JĘZYKU OBCYM MAJĄ PRZELICZNIK 2.0" />-->
      </div>
    </div>

    <div class="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
      <table
        v-if="subjects && subjects.length > 0"
        class="w-full table-auto text-left text-sm text-gray-500 dark:text-gray-400"
      >
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" colspan="2" class="ps-6 text-xl font-semibold">Przydział godzin</th>
            <th scope="col" colspan="1" class="text-center">Ilość grup</th>
            <th scope="col" colspan="1" class="text-center">Suma godzin</th>
            <th scope="col" rowspan="2" class="w-[24px] text-center">Ilość grup</th>
            <th scope="col" rowspan="2" class="w-[24px] text-center">Suma godzin</th>
          </tr>
          <tr>
            <th scope="col" class="ps-6">Przedmiot</th>
            <th scope="col" class="">Specjalność</th>
            <th scope="col" class="text-center">
              <span
                v-for="(ct, index) in classTypes?.member as ClassType[]"
                :key="ct.id"
                :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
              >
                {{ ct.abbreviation }}
              </span>
            </th>
            <th scope="col" class="text-center">
              <span
                v-for="(ct, index) in classTypes?.member as ClassType[]"
                :key="ct.id"
                :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
              >
                {{ ct.abbreviation }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="subject in subjects as SubjectLecturer[]"
            :key="subject['@id']"
            class="border-b border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
          >
            <th scope="row" class="whitespace-nowrap ps-6 text-gray-900 dark:text-white">
              <span>
                {{ subject.name }}
              </span>
            </th>
            <td class="">
              <span>
                {{ getSpecialityShortcut(subject['@id']) }}
              </span>
            </td>
            <td class="text-center">
              <span
                v-for="(ct, index) in classTypes?.member as ClassType[]"
                :key="ct.id"
                :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
              >
                {{ getHoursRatio(subject, ct) }}
              </span>
            </td>
            <td class="text-center">
              <span
                v-for="(ct, index) in classTypes?.member as ClassType[]"
                :key="ct.id"
                :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`"
              >
                {{
                  userData.subjectLecturers.find(
                    (sl) =>
                      typeof sl === 'object' &&
                      sl.classType['@id'] === ct['@id'] &&
                      sl.subject['@id'] === subject['@id']
                  )?.subjectHours ?? '&nbsp;'
                }}
              </span>
            </td>
            <td>{{ sumGroups(subject) }}</td>
            <td>{{ sumHours(subject) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning
      v-if="subjects && subjects.length == 0"
      message="Brak przedmiotów w raporcie."
    />
  </div>
</template>

<style scoped></style>
