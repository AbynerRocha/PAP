import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons'
import formatNumber from '../../utils/formatNumber'
import { twMerge } from 'tailwind-merge'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Api } from '../../utils/Api'
import { AxiosResponse } from 'axios'
import { WorkoutData } from '../../@types/Workout'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import Loading from '../loading'
import { useQuery } from 'react-query'
import { WorkoutLocalStoraged } from '../../database/controller/workout'
import ErrorPage from '../error'

type WorkoutsPreviewData = {
  name: string
  author: {
    name: string
    avatar?: string
  }
  dificultyRate: number
  saves: number
  numberOfExercises: number
}

export default function Workouts() {
  const { user } = useAuth()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [oldWorkouts, setOldWorkouts] = useState<WorkoutData[]>([])
  const [filters, setFilters] = useState([
    { name: 'Salvos', value: 1 },
    { name: 'Populares', value: 2 }
  ])

  const [filterApplied, setFilterApplied] = useState<number>(0)

  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: '@getAllWorkouts',
    queryFn: fetchWorkouts
  })

  const filteredData = useMemo(() => {
    switch (filterApplied) {
      case 0: {
        if (!data) return

        setWorkouts(data)
        break
      }
      case 1: {
        const Storaged = new WorkoutLocalStoraged()

        Storaged.get().then((value) => {
          console.log(value)
          if (!value) return

          // setWorkouts(value)
        })
        break
      }
    }
  }, [filterApplied])

  useEffect(() => {
    if (!data) return

    setWorkouts(data)
    setOldWorkouts(data)
  }, [data])


  function handleSelectFilter(filterId: number) {
    if (filterId === 1) fetchWorkouts()

    if (filterId === filterApplied) {
      setFilterApplied(0)
      return
    }

    setFilterApplied(filterId)
  }

  async function fetchWorkouts() {
    const res = await Api.get(`/workout?p=${page}`)
      .then((res: AxiosResponse<{ workouts: WorkoutData[] }>) => res.data.workouts)
      .catch((err) => { throw err })


    return res
  }

  if (isFetching || isLoading) return <Loading />

  if (error) return <ErrorPage message='Não foi possivel realizar esta ação neste momento.' />

  return (
    <View className='flex-1'>
      <View className='w-full items-center space-y-4'>
        <View className='flex-row space-x-2'>
          <TextInput
            className='w-[70%] bg-neutral-100 border border-neutral-200 rounded-full h-12 px-5 py-3'
            placeholder='Procure aqui'
            placeholderTextColor={'#A3A3A3'}
          />
          <Pressable className='w-12 h-12 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200'>
            <FontAwesome name='search' size={20} color='#A3A3A3' />
          </Pressable>
        </View>
        <View className='w-full h-10 items-center justify-center' >
          <ScrollView horizontal className='flex-row space-x-2'>
            {filters.map((filter, idx) => {
              return <Pressable
                key={idx}
                onPress={() => handleSelectFilter(filter.value)}
                className={twMerge('ml-9 px-6 items-center justify-center h-7 rounded-full', (filterApplied === filter.value && 'bg-blue-800'))}
              >
                <Text className={twMerge('text-xs font-semibold text-neutral-950', (filterApplied === filter.value && 'text-neutral-50'))}>{filter.name}</Text>
              </Pressable>
            })}
          </ScrollView>
        </View>
      </View>

      <View className='flex-1'>
        <FlatList
          data={workouts}
          keyExtractor={(item) => item._id}
          renderItem={({ index, item }) => {
            return <Pressable
              className='m-3 h-20 p-2 rounded-lg border border-neutral-300'
              onPressIn={() => router.push(`/workout/${item._id}`)}
            >
              <View className='w-full h-full justify-between'>
                <Text className='font-semibold'>{item.name}</Text>
                <View className='flex-row space-x-1 justify-between'>
                  <WorkoutDifficulty
                    className='flex-row space-x-1'
                    difficulty={calcWorkoutDifficulty(item.exercises)}
                  />

                  <View className='flex-row items-center space-x-1'>
                    <Ionicons name="cloud-download-outline" size={13} color="rgb(160 160 160)" />
                    <Text className='text-xs text-neutral-400'>{formatter.format(item.saves + 10000)}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          }}
        />
      </View>


      {user && <View>
        <Link href='/workout/create' className='absolute bottom-10 right-0 mr-3'>
          <View className='bg-blue-800 rounded-full h-16 w-16  items-center justify-center shadow-md shadow-black/50'>
            <FontAwesome name='plus' color='white' size={20} />
          </View>
        </Link>
      </View>}
    </View>
  )
}