<script setup lang="ts">
const routeString = useRoute()
const id = routeString.params.id
const usrRoute = `/api/users/${id}`
const slRoute = `/api/subject_lecturers?user.id=${id}`
const sRoute = `/api/subjects?subjectLecturers.user.id=${id}`
const ctRoute = `/api/class_types`
const {data: userData} = await useFetch<ApiUser>(usrRoute)
const {data} = await useFetch<{ member: SubjectLecturer[] }>(slRoute)
const {data: subjects} = await useFetch<{ member: Subject[] }>(sRoute)
const {data: classTypes} = await useFetch<{ member: ClassType[] }>(ctRoute)
useHead(
    computed(() => {
      if (data.value) {
        return {
          title: `Raport ${userData.value?.first_name} ${userData.value?.last_name}`
        }
      } else {
        return {
          title: `Raport`
        }
      }
    })
)
const {getSession} = useAuth()
const user = await getSession()
const isAdmin = user && user.roles.includes('ROLE_ADMIN')

const getHoursRatio = (sl: SubjectLecturer, ct: ClassType): number|'\u00A0' => {
  const required = sl.subject.subjectHours?.find(
      (sh) => sh.classType['@id'] === ct['@id']
  )?.hoursRequired ?? NaN;

  const val = sl.subjectHours / required;

  return (isNaN(val) || !isFinite(val)) ? '\u00A0' : val;
}

const getSpecialityShortcut = (sl: SubjectLecturer): string => {
  return sl.subject.program.programInMajors.major?.abbreviation + "-"
      + sl.subject.program.programInMajors.educationLevel.abbreviation + "-"
      + sl.subject.program.programInMajors.attendanceMode.abbreviation
}

const sumGroups = (sl: SubjectLecturer): number => {
  return sl.subject.subjectGroups.reduce((sum: number, group: SubjectGroup) => {
    const groupRatio = getHoursRatio(sl, group.classType)
    return sum + (typeof groupRatio === 'number' ? groupRatio : 0)
  }, 0)
}

onMounted(() => {
  console.log(subjects)
})

</script>
<template>
  <div class="container mx-auto p-6 relative overflow-x-auto shadow-md sm:rounded-lg">

    <div v-if="userData" class="grid grid-cols-2">
      <dl class="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        <div class="flex flex-col pb-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Wykładowca</dt>
          <dd class="text-lg font-semibold">{{ userData.position.abbreviation ?? "" }} {{ userData.first_name }}
            {{ userData.last_name }}
          </dd>
        </div>
        <div class="flex flex-col py-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Stanowisko</dt>
          <dd class="text-lg font-semibold">{{ userData.position.description ?? 0 }}</dd>
        </div>
        <div class="flex flex-col pt-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Pensum</dt>
          <dd class="text-lg font-semibold">{{ userData.position.pensum ?? 0 }}</dd>
        </div>
        <div class="flex flex-col pt-3">
          <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Zakład</dt>
          <dd class="text-lg font-semibold">{{ userData.institute.name ?? "" }}</dd>
        </div>
      </dl>
      <div>
      </div>
      <div class="col-span-2 mt-5">
        <AlertDanger title=""
                     message="Suma godzin podzielona przez ilość grup daje ilość godzin przypadającą na jedną grupę."/>
        <AlertDanger title=""
                     message="Jeżeli ilość grup jest liczbą niecałkowitą, to prowadzący realizuje z grupą tylko część zajęć."/>
        <AlertDanger title=""
                     message="Jeżeli ilość grup jest polem pustym to oznacza, iż nastąpił błąd przydziału formy zajęć."/>
        <!--        <AlertWarning title="" message="PRZEDMIOTY PROWADZONE W JĘZYKU OBCYM MAJĄ PRZELICZNIK 2.0" />-->
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
      <table v-if="data"
             class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" colspan="2" class="ps-6 font-semibold text-xl">Przydział godzin</th>
          <th scope="col" colspan="1" class="text-center">Ilość grup</th>
          <th scope="col" colspan="1" class="text-center">Suma godzin</th>
          <th scope="col" rowspan="2" class="text-center w-[24px]">Ilość grup</th>
          <th scope="col" rowspan="2" class="text-center w-[24px]">Suma godzin</th>
        </tr>
        <tr>
          <th scope="col" class="ps-6">
            Przedmiot
          </th>
          <th scope="col" class="">
            Specjalność
          </th>
          <th scope="col" class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
              {{ ct.abbreviation }}
            </span>
          </th>
          <th scope="col" class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
              {{ ct.abbreviation }}
            </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="sl in data?.member" :key="sl.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <th scope="row" class="ps-6 text-gray-900 whitespace-nowrap dark:text-white">
                    <span>
                   {{ sl.subject.name }}
                    </span>
          </th>
          <td class="">
                    <span>
                      {{ getSpecialityShortcut(sl) }}
                    </span>
          </td>
          <td class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
              {{ getHoursRatio(sl, ct) }}
            </span>
          </td>
          <td class="text-center">
            <span v-for="(ct, index) in classTypes?.member as ClassType[]" :key="ct.id"
                  :class="`inline-block w-[32px] text-center ${index !== 0 && index !== classTypes?.member?.length ? 'border-l' : ''}`">
              {{ (sl.classType['@id'] === ct['@id']) ? sl.subjectHours : "&nbsp;" }}
            </span>
          </td>
                    <td>{{ sumGroups(sl) }}</td>
          <td>
            {{sl.subjectHours}}
<!--            {{-->
<!--              sl.subjectHours.reduce((sum: number, hours: SubjectHours) => {-->
<!--                return sum + hours.hoursRequired-->
<!--              })}}-->
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <AlertWarning v-if="data?.member && data?.member?.length == 0"
                  message="Brak przedmiotów w raporcie."/>
  </div>
</template>

<style scoped>
</style>