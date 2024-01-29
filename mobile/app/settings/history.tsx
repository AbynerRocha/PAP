import { View, Text, ScrollView, Pressable, NativeScrollEvent, NativeSyntheticEvent, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { History } from '../../services/workouts'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useQuery } from 'react-query'
import Loading from '../loading'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { HistoryData } from '../../@types/User'


export default function WorkoutHistory() {
  const { user } = useAuth()
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [data, setData] = useState<HistoryData[]>([])

  const { isFetching, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: '@fetchHistory',
    queryFn: async () => {
      const { history, nextPage: nextHistoryPage } = await History.get(user?._id!, 1)

      setNextPage(nextHistoryPage)
      setData(history)

      return history
    }
  })

  if (isLoading || isFetching) return <Loading />

  if (error || !data) return <View className='h-[80%] w-full items-center justify-center bg-slate-50 flex flex-col space-y-2'>
    <Feather name='x-circle' color='red' size={50} />
    <Text className='text-md text-red-500'>Não foi possivel realizar esta ação neste momento</Text>
  </View>

  async function fetchNextPage() {
    if(nextPage === null) return 

    const { history, nextPage: nextHistoryPage } = await History.get(user?._id!, nextPage)

    setNextPage(nextHistoryPage)
    setData((v) => [...v, ...history])
  }

  return (
    <View className='flex-1'>
      <Text
        className='m-4 text-4xl font-bold'>
        Histórico
      </Text>

      <FlatList
        data={data}
        className='mb-9'
        renderItem={({ item: history, index }) => {
          return <View key={index} className='flex-col w-fulç h-20'>
            <Pressable
              cancelable
              className='flex-row space-x-1 w-full h-full'
              onPress={() => router.push(`/workout/${history.workout._id}`)}
            >
              <View className='flex-row items-center justify-between w-[100%] p-2'>
                <Text className='text-lg'>{history.workout.name}</Text>
                <Text className='text-right'>{new Date(history.date).toLocaleDateString('pt-PT')}</Text>
              </View>
            </Pressable>

            <View
              className='h-[1] w-full bg-slate-300'
            />
          </View>
        }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.1}
        ListFooterComponent={nextPage !== null ? <ActivityIndicator size='small' color='black' className='mt-3'/> : null}
      />
    </View>
  )
}