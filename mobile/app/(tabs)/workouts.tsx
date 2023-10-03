import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'

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
  const [workouts, setWorkouts] = useState<WorkoutsPreviewData[]>([
    { name: 'Teste 1', author: { name: 'Pedro Ribeiro' }, dificultyRate: 3, saves: 1000, numberOfExercises: 12 }
  ])

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
            <Pressable className='ml-9 px-6 items-center justify-center h-7 rounded-full bg-blue-800'>
              <Text className='text-xs font-semibold text-neutral-50'>Populares</Text>
            </Pressable>
            <Pressable className='px-6 items-center justify-center h-7  rounded-full'>
              <Text className='text-xs font-semibold text-neutral-950'>Salvados</Text>
            </Pressable>
            <Pressable className='px-6 items-center justify-center h-7  rounded-full'>
              <Text className='text-xs font-semibold text-neutral-950'>Para homens</Text>
            </Pressable>
            <Pressable className='mr-8 px-6 items-center justify-center h-7  rounded-full'>
              <Text className='text-xs font-semibold text-neutral-950'>Para mulheres</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <View className='flex-1 items-center mt-4'>
        {workouts.map((workout) => {
          return (
            <View className='w-[88%] flex-row rounded-2xl bg-neutral-100 h-24 p-3 items-start'>
              <View className='h-full w-fit justify-center'>
                <View className='bg-neutral-300 rounded-full w-14 h-14' />
              </View>

              <View>
                <View>
                  <Text className='text-lg font-semibold text-center ml-3'>{workout.name}</Text>
                  <Text className='text-xs font-semibold text-neutral-300 ml-4'>{workout.numberOfExercises} exercícios</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}