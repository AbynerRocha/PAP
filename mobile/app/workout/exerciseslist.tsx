import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { Feather, Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Api } from '../../utils/Api';
import { AxiosError } from 'axios';
import { ExerciseData } from '../../@types/Exercise';
import { Image } from 'moti';
import { twMerge } from 'tailwind-merge';
import { MuscleData } from '../../@types/Muscle';

type FiltersData = {
  name: string
  muscle: MuscleData[]
}

type ExerciseListProps = {
  onExercisesChange: (changes: ExerciseData[]) => void
  onStateChange: (state: boolean) => void
  exercises: ExerciseData[]
}

export default function ExercisesList({ onExercisesChange, exercises, onStateChange }: ExerciseListProps) {
  const [page, setPage] = useState(1)
  const [fetchedExercises, setFetchedExercises] = useState<ExerciseData[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [muscles, setMuscles] = useState<MuscleData[]>([])
  const [filters, setFielters] = useState<FiltersData>({
    name: '',
    muscle: []
  })
  const [exerciseSelectedList, setExerciseSelectedList] = useState<ExerciseData[]>([...exercises])

  useEffect(() => {
    fetchExercises()
    fetchMuscles()
  }, [])

  function getFilteredExercises() {
    let filteredMuscles: ExerciseData[] = []
    if (!fetchedExercises || !filters) return

    const regex = new RegExp(`.*${filters.name}*.`, 'i')

    for (const exercise of fetchedExercises) {
      if (filteredMuscles.includes(exercise)) return

      if (filters.name !== '' && exercise.name.match(regex)) {
        filteredMuscles.push(exercise)
      }

      for (const muscle of filters.muscle) {
        if (exercise.muscle._id === muscle._id) {
          filteredMuscles.push(exercise)
        }
      }
    }

    return filteredMuscles
  }

  function fetchMuscles() {
    setIsFetching(true)

    Api.get('/muscle')
      .then((res) => {
        setMuscles(res.data.muscles)
      })
      .finally(() => setIsFetching(false))
  }

  function fetchExercises() {
    Api.get(`/exercise?p=${page}`)
      .then((res) => {
        const exerciseFetched: ExerciseData[] = res.data.exercises

        if(exercises.length > 0) {
          const filtered = exerciseFetched.filter((e) => { return exercises.indexOf(e) === -1 })
          console.log(exercises);
          
          setFetchedExercises(filtered)
          return
        }
        
        setFetchedExercises(exerciseFetched)
      })
      .catch((err: AxiosError<any>) => {
        setFetchError(err.response?.data.message)
      })
  }

  function handleSelectExercise(exercise: ExerciseData) {
    if (exerciseSelectedList.find((e) => e === exercise)) {
      setExerciseSelectedList((v) => v.filter(e => e !== exercise))
      return
    }

    setExerciseSelectedList((v) => ([...v, exercise]))
  }

  function handleChangeExercises() {
    let data = []

    for (const exercise of exerciseSelectedList) {
      if (exercises.find(e => e === exercise)) continue

      data.push(exercise)
    }

    onExercisesChange(data)
    onStateChange(false)
  }

  if (isFetching) return <View className='h-screen w-screen items-center justify-center bg-neutral-50'>
    <ActivityIndicator size='large' color='black' />
  </View>

  if (fetchError !== '') return <View className='h-screen w-screen items-center justify-center bg-neutral-50 space-y-2'>
    <Feather name='x-circle' color='red' size={40} />
    <Text className='text-md font-medium text-center'>Erro: {fetchError}</Text>
  </View>

  return <View className='h-screen w-screen p-3 items-center justify-center bg-neutral-50'>
    <Text className='text-center text-xl font-medium mb-3'>Selecione os exercicios</Text>

    <View className='w-full p-3'>
      <Input
        className='w-full h-12 p-3 rounded-xl border border-neutral-300'
        placeholder='Procure aqui'
        onChangeText={(text) => {
          if (text.length > 0) {
            setFielters((f) => ({ name: text, muscle: f.muscle }))
          }
        }}
      />
      <ScrollView horizontal className='flex-row space-x-2 p-3'>
        {muscles.map((muscle, idx) => {
          const filtered = filters.muscle.find((m) => m._id === muscle._id)

          return <Pressable
            key={idx}
            className={twMerge('w-24 h-7 rounded-full items-center justify-center', (filtered ? 'bg-blue-700' : 'bg-transparent'))}
            onPress={() => {
              if (filtered) {
                const updated = filters.muscle.filter((m) => m._id !== filtered._id)

                setFielters((f) => ({ name: f.name, muscle: updated }))
                return
              }

              const muscleFilters = filters

              muscleFilters.muscle.push(muscle)

              setFielters((f) => ({ name: f.name, muscle: [...f.muscle] }))
            }}
          >
            <Text className={twMerge('font-medium', (filtered ? 'text-neutral-50' : 'text-neutral-950'))}>{muscle.name.length > 10 ? muscle.name.slice(0, 10) + '...' : muscle.name}</Text>
          </Pressable>
        })}
      </ScrollView>
    </View>
    <ScrollView className='h-[90%] w-full space-y-3'>
      {filters.name === '' && filters.muscle.length === 0 ?
        fetchedExercises?.map((exercise, idx) => {
          return <Pressable
            key={idx}
            className='p-3 h-20 w-full bg-neutral-100 border border-neutral-300 rounded-lg flex-row justify-between space-x-2'
            onPress={() => handleSelectExercise(exercise)}
          >
            <View className='flex-row space-x-2 items-center'>
              <View className='w-fit h-fit rounded-full'>
                <Image
                  source={{ uri: exercise.image }}
                  alt={exercise.name}
                  height={50}
                  width={50}
                  className='object-cover'
                />
              </View>
              <View>
                <Text className='font-medium text-md'>{exercise.name.length > 24 ? exercise.name.slice(0, 24) + ' ...' : exercise.name}</Text>
              </View>
            </View>
            <View>
              {exerciseSelectedList.find((e) => e._id === exercise._id) && <View
                className='bg-blue-700 rounded-full w-6 h-6  items-center justify-center'
              >
                <Text className='text-s font-semibold text-neutral-50'>{exerciseSelectedList.findIndex((e) => e._id === exercise._id) + 1}</Text>
              </View>}
            </View>
          </Pressable>
        })
        : getFilteredExercises()?.map((exercise, idx) => {
          return <Pressable
            key={idx}
            className='p-3 h-20 w-full bg-neutral-100 border border-neutral-300 rounded-lg flex-row justify-between space-x-2'
            onPress={() => handleSelectExercise(exercise)}
          >
            <View className='flex-row space-x-2 items-center'>
              <View className='w-fit h-fit rounded-full'>
                <Image
                  source={{ uri: exercise.image }}
                  alt={exercise.name}
                  height={50}
                  width={50}
                  className='object-cover'
                />
              </View>
              <View>
                <Text className='font-medium text-md'>{exercise.name.length > 24 ? exercise.name.slice(0, 24) + ' ...' : exercise.name}</Text>
              </View>
            </View>
            <View>
              {exerciseSelectedList.find((e) => e._id === exercise._id) && <View
                className='bg-blue-700 rounded-full w-6 h-6  items-center justify-center'
              >
                <Text className='text-s font-semibold text-neutral-50'>{exerciseSelectedList.findIndex((e) => e._id === exercise._id) + 1}</Text>
              </View>}
            </View>
          </Pressable>
        })
      }
    </ScrollView>

    <View className='absolute bottom-1 w-full h-20'>
      <View className='flex-row w-full h-full space-x-2 justify-center items-center'>
        <Button onPressIn={handleChangeExercises}>
          Adicionar
        </Button>
        <Button onPress={() => onStateChange(false)} color='red' size='sm'>Cancelar</Button>
      </View>
    </View>
  </View>
}
