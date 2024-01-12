import { View, Text, ScrollView, Pressable, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { History } from '../../services/workouts'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useQuery } from 'react-query'
import Loading from '../loading'
import { Feather } from '@expo/vector-icons'
import AnimatedAccordion from "@dev-event/react-native-accordion";
import { router } from 'expo-router'
import { MotiText, MotiView, useAnimationState, useDynamicAnimation } from 'moti'

export default function WorkoutHistory() {
  const { user } = useAuth()
  const [isShowing, setIsShowing] = useState<boolean[]>([])
  const [scrollPos, setScrollPos] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)

  const data: { name: string, date: Date }[] = [
    { name: 'Teste 1', date: new Date() },
    { name: 'Teste 2', date: new Date() },
    { name: 'Teste 3', date: new Date() },
    { name: 'Teste 4', date: new Date() },
    { name: 'Teste 5', date: new Date() },
    { name: 'Teste 6', date: new Date() },
    { name: 'Teste 7', date: new Date() },
    { name: 'Teste 7', date: new Date() },
    { name: 'Teste 7', date: new Date() },
    { name: 'Teste 7', date: new Date() },
    { name: 'Teste 7', date: new Date() },
    { name: 'Teste 7', date: new Date() },
    { name: 'Teste 7', date: new Date() },
  ]

  const textAnimation = useDynamicAnimation(() => ({
    scale: 1
  }))

  const { isFetching, isLoading, error } = useQuery({
    queryKey: '@fetchHistory',
    queryFn: async () => {
      const historyData = await History.getAll(user?._id!)

      return historyData
    }
  })

  useEffect(() => {
    let states: boolean[] = []
    data?.forEach((v) => {
      states.push(false)
    })

    setIsShowing(states)
  }, [])

  if (isLoading || isFetching) return <Loading />

  if (error || !data) return <View className='h-[80%] w-full items-center justify-center bg-neutral-50 flex flex-col space-y-2'>
    <Feather name='x-circle' color='red' size={50} />
    <Text className='text-md text-red-500'>Não foi possivel realizar esta ação neste momento</Text>
  </View>

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { y } = event.nativeEvent.contentOffset
    setScrollPos(y)
  }

  return (
    <View className='flex-1'>
      <MotiView
        state={textAnimation}
      >
        <Text className='m-4 text-4xl font-bold'>
          Histórico
        </Text>
      </MotiView>
      <ScrollView
        className='mb-9'
        onScroll={handleScroll}
        onLayout={(e) => {
          setScrollHeight(e.nativeEvent.layout.height)
        }}
      >
        {data.map((history, idx) => {
          return <View key={idx} className='flex-col w-fulç h-20'>
            <Pressable
              cancelable
              className='flex-row space-x-1 w-full h-full'
            // onPressIn={() => router.push(`/workout/${history.workout._id}`)}
            >
              <View className='flex-row items-center justify-between w-[100%] p-2'>
                <Text className='text-lg'>{history.name}</Text>
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