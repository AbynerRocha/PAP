import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ExerciseInfo } from '../../../../@types/Workout'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorageKeys } from '../../../../database/keys'
import { useExercisesStore } from '../../../../utils/states/exercises'

type Params = {
  exercises: string
}

export default function StartExercise() {
  const [exercises, setExercises] = useState<ExerciseInfo[]>(useExercisesStore((state) => state.exercises))
  const [toDoExercise, setToDoExercise] = useState(exercises[1])

  const numberOfExercises = exercises.length

  const router = useRouter()

  function renderTopBalls() {
    const toDoExerciseIdx = exercises.findIndex(ex => ex === toDoExercise)
    var tmpNumberOfExercises = numberOfExercises
    var remainingExercises = numberOfExercises-(toDoExerciseIdx+1)

    var JSX: React.ReactNode[] = []

    while(tmpNumberOfExercises != 0) {
      if(remainingExercises > 0) {
        JSX.push(<View key={tmpNumberOfExercises} className='rounded-full bg-neutral-400 h-2 w-2' />)
        remainingExercises = remainingExercises - 1
        tmpNumberOfExercises = tmpNumberOfExercises - 1
      } else {
        JSX.push(<View key={tmpNumberOfExercises} className='rounded-full bg-neutral-50 h-2 w-2' />)
        tmpNumberOfExercises = tmpNumberOfExercises - 1
      }
    }

    return JSX
  }

  /*
    function renderDifficulty() {
    let maxDifficulty = 5
    let tempDifficulty = difficulty

    const JSX: React.ReactNode[] = []

    const [color1, color2] = colors

    while (maxDifficulty != 0) {
      if (tempDifficulty > 0) {
        JSX.push(<FontAwesome5 key={maxDifficulty} name="dumbbell" size={13} color={invertColor ? color2 : color1} />)
        tempDifficulty = tempDifficulty - 1
        maxDifficulty = maxDifficulty - 1
      } else {
        JSX.push(<FontAwesome5 key={maxDifficulty} name="dumbbell" size={13} color={invertColor ? color1 : color2} />)
        maxDifficulty = maxDifficulty - 1
      }
    }

    return JSX
  }

  */

  return (
    <View className='flex-1'>
      <View
        className='h-16 w-full bg-blue-700 justify-center p-3 flex-col space-y-2'
      >
        <View className='w-full'>
          <Text className='text-neutral-50 font-medium text-center text-lg'>{toDoExercise.exercise.name}</Text>
        </View>
        <View className='flex-row w-full justify-center items-center space-x-2'>
          {renderTopBalls()}
        </View>
      </View>
      <View className='flex-1 w-full'>
        <View className='items-center mt-6'>
          <Image 
            source={{ uri: toDoExercise.exercise.image }}
            width={250}
            height={250}
            style={{ borderRadius: 400/2 }}
          />
        </View>
        <View className='items-center mt-4'>
          <Text className='text-lg font-medium'>Repetições: {toDoExercise.reps}</Text>
        </View>
      </View>
    </View>
  )
}