import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { History } from '../../services/workouts'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useQuery } from 'react-query'
import Loading from '../loading'
import { Feather } from '@expo/vector-icons'

export default function WorkoutHistory() {
  const { user } = useAuth()
  const [isShowing, setIsShowing] 

  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: '@fetchHistory',
    queryFn: fetchHistory
  })

  async function fetchHistory() {
    const historyData = await History.getAll(user?._id!)

    return historyData
  }

  if(isLoading || isFetching) return <Loading/>

  if (error || !data) return <View className='h-[80%] w-full items-center justify-center bg-neutral-50 flex flex-col space-y-2'>
    <Feather name='x-circle' color='red' size={50} />
    <Text className='text-md text-red-500'>Não foi possivel realizar esta ação neste momento</Text>
  </View>

  useEffect(() => {
    for(let i = 0; i < data.length; i++) {

    }
  }, [])
  

  return (
    <View className='p-3'>
      <Text className='text-4xl font-bold'>Histórico</Text>
      <View className='my-4' />
      <ScrollView className=''>
        {data.map((history, idx) => {
          return <View key={idx} className='flex-row space-x-1'>
            <View className='flex-row items-center justify-between w-[92%]'>
              <Text className='text-xl'>{history.workout.name}</Text>
              <Text className='text-right'>{new Date(history.date).toLocaleDateString('pt-PT')}</Text>
            </View>
            <View>
              <Feather name='chevron-down' size={28} />
            </View>

            {}
          </View>
        })}
      </ScrollView>
    </View>
  )
}