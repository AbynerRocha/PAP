import { View, Text, ScrollView, Pressable, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { History } from '../../services/workouts'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useQuery } from 'react-query'
import Loading from '../loading'
import { Feather } from '@expo/vector-icons'
import { MotiView, MotiText, motify, useDynamicAnimation, useAnimationState } from 'moti'
import { useRouter } from 'expo-router'


export default function WorkoutHistory() {
  const { user } = useAuth()
  const router = useRouter()

  const { data, isFetching, isLoading, error } = useQuery({
    queryKey: '@fetchHistory',
    queryFn: async () => {
      const historyData = await History.getAll(user?._id!)

      return historyData
    }
  })

  if (isLoading || isFetching) return <Loading />

  if (error || !data) return <View className='h-[80%] w-full items-center justify-center bg-neutral-50 flex flex-col space-y-2'>
    <Feather name='x-circle' color='red' size={50} />
    <Text className='text-md text-red-500'>Não foi possivel realizar esta ação neste momento</Text>
  </View>


  return (
    <View className='flex-1'>
      <Text
        className='m-4 text-4xl font-bold'>
        Histórico
      </Text>
      <ScrollView
        className='mb-9'
      >
        {data.map((history, idx) => {
          return <View key={idx} className='flex-col w-fulç h-20'>
            <Pressable
              cancelable
              className='flex-row space-x-1 w-full h-full'
            onPressIn={() => router.push(`/workout/${history.workout._id}`)}
            >
              <View className='flex-row items-center justify-between w-[100%] p-2'>
                <Text className='text-lg'>{history.workout.name}</Text>
                <Text className='text-right'>{new Date(history.date).toLocaleDateString('pt-PT')}</Text>
              </View>
            </Pressable>

            <View
              className='h-[1] w-full bg-neutral-300'
            />
          </View>
        })}
      </ScrollView>
    </View>
  )
}