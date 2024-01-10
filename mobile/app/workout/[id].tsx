import { View, Text, FlatList, Image, RefreshControl, ScrollView, Pressable, Vibration } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Api } from '../../utils/Api'
import { ExerciseInfo, WorkoutData } from '../../@types/Workout'
import Loading from '../loading'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useQuery } from 'react-query'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import { clientQuery } from '../../utils/queryClient'
import { WorkoutLocalStoraged } from '../../database/controller/workout'
import { MotiPressable } from 'moti/interactions'
import { MotiView, useAnimationState, useDynamicAnimation } from 'moti'
import WorkoutService from '../../services/workouts'
import { useAuth } from '../../contexts/Auth/AuthContext'

type Params = {
  id: string
}

export default function Workout() {
  const { id } = useLocalSearchParams<Params>()
  const { user } = useAuth()
  const [data, setData] = useState<WorkoutData>()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [saved, setSaved] = useState(false)

  const router = useRouter()

  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })
  const { data: fetchedData, error, isLoading, isFetching, refetch } = useQuery({ queryKey: '@fetchWorkout', queryFn: fetchWorkoutData })

  const localStoraged = new WorkoutLocalStoraged()

  const scrollRef = useRef(null)

  const functionBarState = useDynamicAnimation(() => ({
    opacity: 1
  }))


  useEffect(() => {
    setData(fetchedData)
  }, [fetchedData])

  async function fetchWorkoutData() {
    const res = await Api.get<{ workout: WorkoutData }>(`/workout?id=${id}`)
    const fetchedData = res.data.workout

    WorkoutService.isSaved(user?._id!, fetchedData._id)
    .then(() => setSaved(true))
    .catch(() => setSaved(false))

    return fetchedData
  }

  if (isFetching || isLoading) return <Loading />


  function handleSaveWorkout() {
    if(!data) return 

    if(saved) {
      WorkoutService.unSave(user?._id!, data._id)
      .then(() => setSaved(false))
      return 
    }

    WorkoutService.save(user?._id!, data._id)
    .then(() => setSaved(true))
  }

  function handleScroll(event: { nativeEvent: { contentOffset: { y: number }; layoutMeasurement: { height: number }; contentSize: { height: number } } }) {
    const scrollY = event.nativeEvent.contentOffset.y;
    const totalHeight = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;

    const hideOpacity = 0.2

    if (scrollY >= totalHeight) {
      functionBarState.animateTo({
        opacity: hideOpacity
      })
    } else {
      if(functionBarState.current?.opacity === hideOpacity) {
        functionBarState.animateTo({ 
          opacity: 1
        })
      }
    }
  }

  return (
    <>
      <ScrollView
        ref={scrollRef}
        className='flex-1 mb-12'
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true)
              refetch().finally(() => setIsRefreshing(false))
            }}
          />
        }
        onScroll={handleScroll}
      >
        <View className='w-full h-40 bg-blue-800 items-center p-3'>
          <View className='mt-10'>
            <Text className='text-neutral-50 font-semibold text-4xl italic'>{data?.name}</Text>
          </View>
          <View className='flex-1 w-full justify-between items-center flex-row '>
            <View className='flex-row items-center space-x-1'>
              <Feather name="user" size={20} color="rgb(250 250 250)" />
              <Text className='text-md text-neutral-50'>{data?.createdBy.name}</Text>
            </View>
            <WorkoutDifficulty
              className='flex-row space-x-1'
              colors={['black', 'rgb(250 250 250)']}
              invertColor
              difficulty={data?.exercises ? calcWorkoutDifficulty(data?.exercises) : 0}
            />

            <View className='flex-row items-center space-x-1'>
              <Ionicons name="cloud-download-outline" size={20} color="rgb(250 250 250)" />
              <Text className='text-md text-neutral-50'>{formatter.format(data?.saves! + 10000)}</Text>
            </View>
          </View>
        </View>

        <View className='flex-1 w-full'>
          {data?.exercises.map(({ exercise, series }, index) => {
            return <View
              key={index}
              className='border border-neutral-300 rounded-lg mx-3 p-3 my-2 h-20 items-center flex-row space-x-2'
            >
              <View>
                <Image
                  source={{ uri: exercise.image }}
                  alt={exercise.name}
                  width={50}
                  height={50}
                />
              </View>
              <View className='flex-col space-x-1 items-start'>
                <Text className='text-neutral-900 font-medium text-md ml-1'>{exercise.name}</Text>
                <Text className='text-neutral-400 text-xs'>{series.length} series</Text>
              </View>
            </View>
          })}
          
        </View>


      </ScrollView>
      <MotiView 
        className='bg-neutral-50 h-20 w-[94%] mx-3 p-1 flex-row items-center justify-around absolute bottom-10 rounded-lg border border-neutral-300 shadow-md shadow-black/40'
        state={functionBarState}
      >
        <Pressable
          onPress={handleSaveWorkout}
          className='items-center p-1'
        >
          <MotiView
            className='absolute'
            animate={{
              scale: saved ? 0 : 1
            }}
            transition={{
              duration: 200,
              type: 'spring'
            }}
          >
            <Ionicons name='heart-outline' size={25} color='black' />
          </MotiView>
          <MotiView
            className='absolute'
            animate={{
              scale: saved ? 1 : 0
            }}
            transition={{
              type: 'spring'
            }}
          >
            <Ionicons name='heart' size={25} color='red' />
          </MotiView>
          <Text className='mt-6'>{saved ? 'Retirar' : 'Salvar'}</Text>

        </Pressable>
        <Pressable 
          className='items-center space-y-1'
          onPress={() => {
            router.push(`/workout/start/${data?._id}`)
          }}
        >
          <Feather name="external-link" size={24} color="black" />
          <Text>Iniciar</Text>
        </Pressable>
      </MotiView>
    </>
  )
}