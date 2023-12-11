import { View, Text, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import formatNumber from '../../utils/formatNumber'
import { twMerge } from 'tailwind-merge'
import { Link } from 'expo-router'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Api } from '../../utils/Api'
import { AxiosResponse } from 'axios'
import { WorkoutData } from '../../@types/Workout'

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

  const [page, setPage] = useState(1)
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [filters, setFilters] = useState([
    { name: 'Criados por ti', value: 1 },
    { name: 'Salvos', value: 2 },
    { name: 'Populares', value: 3 }
  ])
  const [filterApplied, setFilterApplied] = useState<number>(0)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  function handleSelectFilter(filterId: number) {
    if (filterId === 1) fetchWorkouts()

    if (filterId === filterApplied) {
      setFilterApplied(0)
      return
    }

    setFilterApplied(filterId)
  }

  function fetchWorkouts() {
    Api.get(`/workout?p=${page}`)
      .then((res: AxiosResponse<{ workouts: WorkoutData[] }>) => {
        const workouts = res.data.workouts

        setWorkouts(workouts)
      })
      .catch((err) => console.error(err))
      .finally(() => setIsFetching(false))
  }

  if (isFetching) return <View className='flex-1 items-center justify-center'>
    <ActivityIndicator size='large' color='black' />
  </View>

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
          <ScrollView horizontal className='flex-row space-x-2 '>
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
      <ScrollView className='flex-col space-y-3'>

        {workouts.length > 0 && workouts.map((workout, idx) => {
          return <View key={idx} className='w-fit h-16 mx-3 p-2 rounded-lg border border-neutral-300' >
            <View className='h-full w-full justify-center'>
              <Text className='font-semibold'>{workout.name}</Text>
              <Text></Text>
            </View>
          </View>
        })}
      </ScrollView>
      </View>


      {user && <View>
        <Link href='/workout/create' className='absolute bottom-2 right-0 mr-3'>
          <View className='bg-blue-800 rounded-full h-16 w-16  items-center justify-center shadow-md shadow-black/50'>
            <FontAwesome name='plus' color='white' size={20} />
          </View>
        </Link>
      </View>}
    </View>
  )
}