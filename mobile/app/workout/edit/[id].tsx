import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Api } from '../../../utils/Api'
import { WorkoutData } from '../../../@types/Workout'
import Input from '../../../components/Input'
import { Controller, useForm } from 'react-hook-form'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { ExerciseData } from '../../../@types/Exercise'
import { twMerge } from 'tailwind-merge'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Params = {
  id: string
}

type Fields = {
  name: string
}

export default function Workout() {
  const { id } = useLocalSearchParams<Params>()
  const [data, setData] = useState<WorkoutData>()
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const router = useRouter()
  const { control, formState: { errors }, handleSubmit } = useForm<Fields>()

  useEffect(() => {
    Api.get(`/workout?id=${id}`)
      .then((res) => {
        setData(res.data.workout)
        setExercises(res.data.workout.exercises)
      })
  }, [])

  function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...exercises];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setExercises(copy);
  }

  return (
    <View className='flex-1'>
      <View className='flex-row items-center'>
        <Pressable className='ml-3' onPress={() => router.replace('/(tabs)/user_workouts')}>
          <Feather name='chevron-left' size={30} />
        </Pressable>
        <View className='flex-1'>
          <Text className='mt-4 text-xl font-semibold text-center mr-5'>Editar {data && data.name.length > 18 ? data?.name.slice(0, 18) + '...' : data?.name}</Text>
        </View>
      </View>
      <View>
        <Controller
          name='name'
          control={control}
          rules={{ required: { value: true, message: 'Este campo é obrigatório.' } }}
          render={({ field: { onBlur, onChange, value } }) => (
            <View className='justify-center flex-col mx-3 mt-3 space-y-2'>
              <Text className='text-xs text-neutral-700'>Nome</Text>
              <Input
                placeholder='Digite aqui'
                className='bg-transparent border border-neutral-300 p-3 rounded-lg text-neutral-700'
                defaultValue={data?.name}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </View>
          )}
        />
      </View>

      <View className='w-full h-0.5 bg-neutral-200 mt-3' />

      <View className='w-full h-[90%]'>
        <DragList
          data={exercises}
          onReordered={onReordered}
          keyExtractor={(keyData: ExerciseData) => keyData._id}
          renderItem={({ item, isActive, onDragStart, onDragEnd }: DragListRenderItemInfo<ExerciseData>) => {
            return (
              <Pressable
                key={item._id}
                className={twMerge('text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center', (isActive && 'opacity-50'))}
                onPressIn={onDragStart}
                onPressOut={onDragEnd}
              >
                <View className='flex-1 flex-row space-x-2 items-center'>
                  <Image
                    source={{ uri: item.image }}
                    width={40}
                    height={40}
                  />
                  <Text className='text-md font-medium'>{item.name}</Text>
                </View>
                <View>
                  <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
                </View>
              </Pressable>
            )
          }}
        />
      </View>
    </View>
  )
}