import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { Feather, Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { Api } from '../../utils/Api';
import { Exercise } from '../../@types/Workout';
import { AxiosError } from 'axios';
import { ExerciseData } from '../../@types/Exercise';

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

    useEffect(() => fetchExercises(), [])

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

    if(isFetching) return <View className='h-screen w-screen items-center justify-center bg-neutral-50'>
      <ActivityIndicator size='large' color='black' />
    </View>
    
    if(fetchError !== '') return <View className='h-screen w-screen items-center justify-center bg-neutral-50 space-y-2'>
      <Feather name='x-circle' color='red' size={40} />
      <Text className='text-md font-medium text-center'>Erro: {fetchError}</Text>
    </View>

    return <View className='h-screen w-screen p-3 items-centerjustify-center bg-neutral-50'>
      {fetchedExercises?.map((exercise, idx) => {
        return <Text className='text-lg font-medium'>{exercise.name} criado por {exercise.createdBy.name}</Text>
      })} 

      <Button className='absolute bottom-2 right-[115px]' onPress={fetchExercises}>Refetch</Button>
    </View>
  }

  return showExerciseList ? <ExercisesList/>  : (
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