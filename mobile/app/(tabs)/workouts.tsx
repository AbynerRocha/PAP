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
    { name: 'Teste 1', author: { name: 'Pedro Ribeiro' }, dificultyRate: 3, saves: 10000, numberOfExercises: 12 }
  ])

  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })

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

      <View className='h-[84%] w-full'>
        <Pressable className='absolute bottom-1 right-0 bg-blue-800 rounded-full h-16 w-16 mr-3 items-center justify-center shadow-md shadow-black/50'>
          <FontAwesome name='plus' color='white' size={20} />
        </Pressable>
      </View>
    </View>
  )
}