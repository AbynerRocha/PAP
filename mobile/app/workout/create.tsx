import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { ExerciseData } from '../../@types/Exercise';
import ExercisesList from './exerciseslist';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { twMerge } from 'tailwind-merge';
import { Api } from '../../utils/Api';
import { useAuth } from '../../contexts/Auth/AuthContext';
import { AxiosError } from 'axios';
import { Divider, Menu } from 'native-base';
import { WorkoutLocalStoraged } from '../../database/controller/workout';

type Fields = {
  name: string
}

type WorkoutExecutionData = {
  exercise: string
  reps: number
  restTime: number
}

export default function CreateWorkout() {
  const { formState: { errors }, control, setError, handleSubmit } = useForm<Fields>()
  const router = useRouter()
  const { user } = useAuth()

  const [showExerciseList, setShowExerciseList] = useState(false)
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [workoutExecutionInfo, setWorkoutExecutionInfo] = useState<WorkoutExecutionData[]>([])
  const [exerciseSelected, setExerciseSelected] = useState<ExerciseData>()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setWorkoutExecutionInfo([])

    for (const exercise of exercises) {
      setWorkoutExecutionInfo((v) => [...v, { exercise: exercise._id!, reps: 10, restTime: 60 }])
    }
  }, [showExerciseList])

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...exercises];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setExercises(copy);
  }

  function handleCreate({ name }: Fields) {
    setIsLoading(true)

    if (exercises.length < 2) {
      setError('root', { message: 'Você precisa adicionar ao menos 2 exercícios.' })
      return
    }

    Api.post('/workout', {
      name,
      createdBy: user?._id,
      exercises: workoutExecutionInfo
    }).then((res) => {
      router.push(`/workout/${res.data.workout._id}`)

      const storage = new WorkoutLocalStoraged()

      storage.save(res.data.workout)
    })
      .catch((err: AxiosError<any>) => {
        setError('root', { message: err.response?.data.message })
      })
      .finally(() => setIsLoading(false))
  }

  return showExerciseList ? <ExercisesList
    onStateChange={setShowExerciseList}
    onExercisesChange={setExercises}
    exercises={exercises}
  /> : (
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
          rules={{ required: { value: true, message: 'Este campo é obrigatório.' } }}
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
                {errors.name && <Text className='text-red-500 text-sm mt-2'>{errors.name.message}</Text>}
                {errors.root && <Text className='text-red-500 text-sm mt-2'>{errors.root.message}</Text>}
              </View>
            )
          }}
        />
      </View>

      <View
        className='w-full h-[1px] bg-neutral-300'
      />
      <View
        className='flex-1 w-full'
      >

        <DragList
          data={exercises}
          onReordered={onReordered}
          keyExtractor={(data: ExerciseData) => data._id}
          renderItem={(data: DragListRenderItemInfo<ExerciseData>) => {
            return (
              <Menu
                onOpen={() => {
                  setExerciseSelected(data.item)
                }}
                onClose={() => {
                  setExerciseSelected(undefined)
                }}
                closeOnSelect={true}
                trigger={(triggerProps => {
                  return <Pressable
                    {...triggerProps}
                    key={data.index}
                    className={twMerge('text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center', (data.isActive && 'opacity-50'))}
                    onLongPress={data.onDragStart}
                    onPressOut={data.isActive ? data.onDragEnd : () => { }}
                  >
                    <View className='flex-1 flex-row space-x-2 items-center'>
                      <Image
                        source={{ uri: data.item.image }}
                        width={40}
                        height={40}
                      />
                      <Text className='text-md font-medium'>{data.item.name}</Text>
                    </View>
                    <View>
                      <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
                    </View>
                  </Pressable>
                })}
              >
                <View className='flex-row justify-around space-x-2 p-2'>
                  <View className='justify-center items-center space-y-1'>
                    <Text className='text-xs'>Número de Reps.</Text>
                    <Input
                      defaultValue={workoutExecutionInfo.find(w => w.exercise === exerciseSelected?._id)?.reps.toString()}
                      className='bg-transparent border border-neutral-300 mx-3 w-12 h-12 text-center text-lg font-semibold'
                      onChangeText={(value) => {
                        const exerciseData = workoutExecutionInfo.find(w => w.exercise === exerciseSelected?._id)
                        const newReps = parseInt(value)

                        if (!exerciseData || newReps === exerciseData?.reps) return

                        const data = workoutExecutionInfo.filter(w => w.exercise !== exerciseSelected?._id)

                        setWorkoutExecutionInfo([...data, { ...exerciseData, reps: newReps }])
                      }}
                    />
                  </View>



                  <View className='justify-center items-center space-y-1'>
                    <Text className='text-xs mb-1'>Tempo de Descanso</Text>
                    <View className='flex-row items-end mx-3'>
                      <Input
                        defaultValue={workoutExecutionInfo.find(w => w.exercise === exerciseSelected?._id)?.restTime.toString()}
                        keyboardType='numeric'
                        className='bg-transparent border border-neutral-300  w-12 h-12 text-center text-lg font-semibold'
                        onChangeText={(value) => {
                          if(value === '') return

                          const exerciseData = workoutExecutionInfo.find(w => w.exercise === exerciseSelected?._id)
                          const newRestTime = parseInt(value)
  
                          if (!exerciseData || newRestTime === exerciseData?.restTime) return
  
                          const data = workoutExecutionInfo.filter(w => w.exercise !== exerciseSelected?._id)
  
                          setWorkoutExecutionInfo([...data, { ...exerciseData, restTime: newRestTime }])
                        }}
                      />
                      <Text className='text-xs ml-1'>seg.</Text>
                    </View>
                  </View>
                </View>
              </Menu>
            )
          }}
        />
      </View>

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
            isLoading={isLoading}
            className='w-52 h-12 shadow-md shadow-black/50'
            onPress={handleSubmit(handleCreate)}
          >
            Criar
          </Button>
        </View>
      </View>
    </View>
  )
}