import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler'
import formatNumber from '../../utils/formatNumber'
import { twMerge } from 'tailwind-merge'

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
    { name: 'Teste 1', author: { name: 'Pedro Ribeiro' }, dificultyRate: 3, saves: 10011111110, numberOfExercises: 12 }
  ])

  const [filterApplied, setFilterApplied] = useState<number>(0)

  function handleSelectFilter(filterId: number) {
    if (filterId === filterApplied) {
      setFilterApplied(0)
      return
    }

    setFilterApplied(filterId)
  }

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
            <Pressable
              onPress={() => handleSelectFilter(1)}
              className={twMerge('ml-9 px-6 items-center justify-center h-7 rounded-full', (filterApplied === 1 && 'bg-blue-800'))}
            >
              <Text className={twMerge('text-xs font-semibold text-neutral-950', (filterApplied === 1 && 'text-neutral-50'))}>Populares</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSelectFilter(2)}
              className={twMerge('px-6 items-center justify-center h-7 rounded-full', (filterApplied === 2 && 'bg-blue-800'))}
            >
              <Text className={twMerge('text-xs font-semibold text-neutral-950', (filterApplied === 2 && 'text-neutral-50'))}>Salvados</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSelectFilter(3)}
              className={twMerge('px-6 items-center justify-center h-7 rounded-full', (filterApplied === 3 && 'bg-blue-800'))}
            >
              <Text className={twMerge('text-xs font-semibold text-neutral-950', (filterApplied === 3 && 'text-neutral-50'))}>Para homens</Text>
            </Pressable>
            <Pressable
              onPress={() => handleSelectFilter(4)}
              className={twMerge('mr-8 px-6 items-center justify-center h-7 rounded-full', (filterApplied === 4 && 'bg-blue-800'))}
            >
              <Text className={twMerge('text-xs font-semibold text-neutral-950', (filterApplied === 4 && 'text-neutral-50'))}>Para mulheres</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <View className='flex-1 items-center mt-4'>
        {workouts.map((workout, idx) => {
          return (
            <View key={idx} className='w-[88%] flex-row space-x-5 rounded-2xl bg-neutral-100 h-28 p-3 items-start'>
              <View className='h-full w-fit justify-center'>
                <View className='bg-neutral-300 rounded-full w-14 h-14' />
              </View>

              <View className='w-full h-full'>
                <View>
                  <Text className='text-lg font-semibold'>{workout.name}</Text>
                  <Text className='text-xs font-medium text-neutral-300'>{workout.numberOfExercises} exercícios</Text>
                </View>

                <View className='flex-1 flex-row items-end'>
                  <View className='space-y-1'>
                    <Text className='text-neutral-300 text-xs font-semibold'>Nivel de dificuldade</Text>
                    <View className='flex-row space-x-1'>
                      <FontAwesome5 name="dumbbell" size={13} color="#000000" />
                      <FontAwesome5 name="dumbbell" size={13} color="#A3A3A3" />
                      <FontAwesome5 name="dumbbell" size={13} color="#A3A3A3" />
                      <FontAwesome5 name="dumbbell" size={13} color="#A3A3A3" />
                      <FontAwesome5 name="dumbbell" size={13} color="#A3A3A3" />
                    </View>
                  </View>
                  <View className='flex-col w-[35%] space-y-2 items-end'>
                    <View className='items-start justify-start mb-3'>
                      <View className='h-8 w-8 rounded-full bg-blue-200 items-center justify-center'>
                      <FontAwesome name="star" size={16} color="black" />
                      </View>
                    </View>
                    <View className='space-y-1 w-14 h-9'>
                      <View className='flex-row space-x-1 items-center'>
                        <FontAwesome name="cloud-download" size={15} color="#A3A3A3" />
                        <Text className='text-gray-400 text-[11px]'>{formatNumber(workout.saves)}</Text>
                      </View>
                      <View className='flex-row space-x-1 items-center'>
                        <MaterialCommunityIcons name="gender-male-female" size={15} color="#A3A3A3" />
                        <Text className='text-gray-400 text-[11px]'>Unisex</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}