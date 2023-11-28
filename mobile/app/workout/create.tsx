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

type Fields = {
  name: string
}

export default function CreateWorkout() {
  const { formState: { errors }, control, setError, handleSubmit } = useForm<Fields>()
  const router = useRouter()
  const [showExerciseList, setShowExerciseList] = useState(false)

  function ExercisesList() {
    const [page, setPage] = useState(1)
    const [fetchedExercises, setFetchedExercises] = useState<ExerciseData[]>()
    const [isFetching, setIsFetching] = useState(true)
    const [fetchError, setFetchError] = useState('')
    const [muscles, setMuscles] = useState([
      { name: 'Peito', value: 'peito' },
      { name: 'Bicpes', value: 'bicpes' },
      { name: 'Costas', value: 'back' },
      { name: 'Tricpes', value: 'tricpes' },
      { name: 'Quadricpes', value: 'quads' },
      { name: 'Posterior de coxa', value: 'posterior' },
    ])
    const [filters, setFielters] = useState<{ name: string, muscle: { name: string, value: string }[] }>({
      name: '',
      muscle: []
    })
    
    useEffect(() => fetchExercises(), [])

    function getFilteredExercises() {
      let filteredMuscles: ExerciseData[] = []
      if(!fetchedExercises || !filters) return

      for(const exercise of fetchedExercises) {
        if(filteredMuscles.includes(exercise)) return 

        if(filters.name !== '' && exercise.name.match(`.*${filters.name}*.`)) {
          filteredMuscles.push(exercise)
        }

        for(const muscle of filters.muscle) {
          if(exercise.muscle === muscle.value) {
            filteredMuscles.push(exercise)
          }
        }
      }

      return filteredMuscles
    }

    function fetchExercises() {
      setIsFetching(true)

      Api.get(`/exercise/get-all?p=${page}`)
        .then((res) => {
          setFetchedExercises(res.data.exercises)
        })
        .catch((err: AxiosError<any>) => {
          setFetchError(err.response?.data.message)
        })
        .finally(() => setIsFetching(false))
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
            if(text.length > 0) {
              setFielters((f) => ({ name: text, muscle: f.muscle }))
            }
          }}
        />
        <ScrollView horizontal className='flex-row space-x-2 p-3'>
          {muscles.map((muscle, idx) => {
            const filtered = filters.muscle.find((m) => m.value === muscle.value)

            return <Pressable 
              key={idx} 
              className={twMerge('w-24 h-7 rounded-full items-center justify-center', (filtered ? 'bg-blue-700' : 'bg-transparent'))}
              onPress={() => {
                  if(filtered) {
                    const updated = filters.muscle.filter((m) => m.value !== filtered.value)

                    setFielters((f) => ({ name: f.name, muscle: updated }))
                    return
                  }

                  const muscleFilters = filters

                  muscleFilters.muscle.push(muscle)

                  setFielters((f) => ({ name: f.name, muscle: [...f.muscle] }))
              }}
            >
              <Text className={twMerge('font-medium', (filtered ? 'text-neutral-50' : 'text-neutral-950'))}>{muscle.name.length > 10 ? muscle.name.slice(0, 10)+'...' : muscle.name}</Text>
            </Pressable>
          })}
        </ScrollView>
      </View>
      <ScrollView className='h-[90%] w-full space-y-3'>
        {filters.name === '' && filters.muscle.length === 0 ? 
        fetchedExercises?.map((exercise, idx) => {
          return <View
            key={idx}
            className='p-3 h-20 w-full bg-neutral-100 border border-neutral-300 rounded-lg flex-row items-center space-x-2'
          >
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
              <Text className='font-medium text-lg'>{exercise.name}</Text>
            </View>
          </View>
        })
      : getFilteredExercises()?.map((exercise, idx) => {
        return <View
          key={idx}
          className='p-3 h-20 w-full bg-neutral-100 border border-neutral-300 rounded-lg flex-row items-center space-x-2'
        >
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
            <Text className='font-medium text-lg'>{exercise.name}</Text>
          </View>
        </View>
      })
      }
      </ScrollView>

      <Button className='absolute bottom-2 right-[115px]' onPress={fetchExercises}>Refetch</Button>
    </View>
  }

  return showExerciseList ? <ExercisesList /> : (
    <View className='h-screen w-screen'>

      <View className='px-3 pt-2 mb-4 mt-3'>
        <View className='flex-row w-full mb-3'>
          <Pressable
            onPress={() => router.back()}
          >
            <Ionicons name='chevron-back' color='black' size={30} />
          </Pressable>
          <View className='flex-1 items-center justify-center -ml-4'>
            <Text
              className='text-2xl italic font-bold text-center'
            >
              Criar um novo treino
            </Text>
          </View>
        </View>

        <Controller
          control={control}
          name='name'
          render={({ field: { value, name, onBlur, onChange } }) => {
            return (
              <View className='space-y-2'>
                <Text className='text-sm text-neutral-500'>Nome</Text>
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder='Digite aqui'
                  placeholderTextColor='rgb(163 163 163)'
                  className='bg-transparent border border-neutral-300 p-3 rounded-lg text-md'
                />
                {errors.name && <span className='text-red-500 text-sm mt-2'>{errors.name.message}</span>}
              </View>
            )
          }}
        />
        <View className='w-full items-end justify-center mt-3'>

        </View>
      </View>

      <View
        className='w-full h-[1px] bg-neutral-300'
      />

      <ScrollView>

      </ScrollView>

      <View
        className='w-full h-[1px] bg-neutral-300'
      />

      <View className='fixed bottom-3 w-full h-fit flex-col items-center justify-center space-y-2 mt-6'>
        <Pressable
          className='w-52 h-12 bg-blue-700 rounded-xl shadow-md shadow-black/50 flex-row space-x-2 items-center justify-center'
          onPress={() => setShowExerciseList(true)}
        >
          <View>
            <Feather name='plus' size={20} color='white' />
          </View>
          <Text className='text-neutral-50 font-bold'>Adicionar Exercício</Text>
        </Pressable>
        <View>
          <Button
            color='green'
            size='sm'
            textStyle='font-bold'
            className='w-52 h-12 shadow-md shadow-black/50'
          >
            Criar
          </Button>
        </View>
      </View>
    </View>
  )
}