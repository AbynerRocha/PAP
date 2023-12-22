import { View, Text, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Api } from '../../../utils/Api'
import { ExerciseInfo, WorkoutData } from '../../../@types/Workout'
import Input from '../../../components/Input'
import { Controller, useForm } from 'react-hook-form'
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../../components/Button'
import { AxiosError } from 'axios'
import { MotiView, useAnimationState } from 'moti'
import { twMerge } from 'tailwind-merge'
import { Accordion, Menu } from 'native-base'

type Params = {
  id: string
}

type Fields = {
  name: string
}

export default function Workout() {
  const { id } = useLocalSearchParams<Params>()
  const router = useRouter()
  const { control, formState: { errors }, handleSubmit } = useForm<Fields>()

  const [data, setData] = useState<WorkoutData>()
  const [exercises, setExercises] = useState<ExerciseInfo[]>([])
  const [updated, setUpdated] = useState<ExerciseInfo[]>([])
  const [exerciseSelected, setExerciseSelected] = useState<ExerciseInfo>()
  const [isLoading, setIsLoading] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  const notificationErrorAnim = useAnimationState({
    hide: {
      opacity: 0,
      bottom: -200
    },
    show: {
      opacity: 1,
      bottom: 0
    }
  }, {
    from: 'hide',
    to: 'show'
  })

  useEffect(() => {
    Api.get(`/workout?id=${id}`)
      .then((res) => {
        setData(res.data.workout)
        setExercises(res.data.workout.exercises)
        setUpdated(res.data.workout.exercises)
        setNewName(res.data.workout.name)
      })
  }, [])

  useEffect(() => {
    if (error === '') return

    notificationErrorAnim.transitionTo('show')

    setTimeout(() => clearError(), 5000)
  }, [error])

  function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...exercises];
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]);
    setExercises(copy);
  }

  function handleEdit() {
    if (newName === '') {
      setError("O campo 'Nome' é obrigatório.")
      return
    }

    setIsLoading(true)

    Api.put('/workout', {
      id: data?._id,
      name: newName,
      exercises
    })
      .then(() => {
        router.push(`/workout/${data?._id}`)
      })
      .catch((err: AxiosError<any>) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }

  function handleChangeInfo({ exercise, reps, restTime }: ExerciseInfo, index: number) {
    const data = exercises.filter(w => w.exercise._id !== exercise?._id)
    const newData = [...data, { exercise, reps, restTime }]

    setUpdated(newData)

    // onReordered(exercises.findIndex(w => w.exercise._id === exercise?._id), index)
  }

  function clearError() {
    notificationErrorAnim.transitionTo('hide')

    setTimeout(() => setError(''), 500)
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
        <View className='justify-center flex-col mx-3 mt-3 space-y-2'>
          <Text className='text-xs text-neutral-700'>Nome</Text>
          <Input
            placeholder='Digite aqui'
            className='bg-transparent border border-neutral-300 p-3 rounded-lg text-neutral-700'
            defaultValue={data?.name}
            onChangeText={setNewName}
          />
        </View>
      </View>
      <Accordion></Accordion>

      <View className='w-full h-0.5 bg-neutral-200 mt-3' />

      <View className='w-full h-[80%]'>
          <DragList
            data={updated}
            onReordered={onReordered}
            keyExtractor={(data: ExerciseInfo) => data.exercise._id}
            renderItem={({ item, index, onDragEnd, onDragStart, isActive }: DragListRenderItemInfo<ExerciseInfo>) => {
              return (
                <Menu
                onOpen={() => {
                  setExerciseSelected(item)
                }}
                onClose={() => {
                  setExerciseSelected(undefined)
                }}
                closeOnSelect={true}
                trigger={(triggerProps => {
                  return <Pressable
                    {...triggerProps}
                    key={index}
                    className={twMerge('text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center', (isActive && 'opacity-50'))}
                    onLongPress={onDragStart}
                    onPressOut={isActive ? onDragEnd : () => { }}
                  >
                    <View className='flex-1 flex-row space-x-2 items-center'>
                      <Image
                        source={{ uri: item.exercise.image }}
                        width={40}
                        height={40}
                      />
                      <Text className='text-md font-medium'>{item.exercise.name}</Text>
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
                      keyboardType='numeric'
                      defaultValue={item.reps.toString()}
                      className='bg-transparent border border-neutral-300 mx-3 rounded-lg w-12 h-12 text-center text-lg font-semibold'
                      onChangeText={(value) => handleChangeInfo({ exercise: item.exercise, reps: parseInt(value), restTime: item.restTime }, index)}
                    />
                  </View>

                  <View className='justify-center items-center space-y-1'>
                    <Text className='text-xs mb-1'>Tempo de Descanso</Text>
                    <View className='flex-row items-end mx-3'>
                      <Input
                        defaultValue={item.restTime.toString()}
                        keyboardType='numeric'
                        className='bg-transparent border border-neutral-300 rounded-lg w-12 h-12 text-center text-lg font-semibold'
                        onChangeText={(value) => handleChangeInfo({ exercise: item.exercise, reps: item.reps, restTime: parseInt(value) }, index)}
                      />
                      <Text className='text-xs ml-1'>seg.</Text>
                    </View>
                  </View>
                </View>
              </Menu>
              )
            }}
          />


        <View className='absolute w-full flex-col space-y-2 items-center bottom-0'>
          {error !== '' && <MotiView
            className='mx-10 h-fit p-3 bg-red-500/60 rounded-lg'
            state={notificationErrorAnim}
            transition={{
              delay: 450,
              duration: 400
            }}

          >
            <Pressable className='h-fit w-fit flex-row items-center space-x-4' onPress={clearError}>
              <View>
                <Feather name='x' color='white' size={25} />
              </View>
              <View className='break-words pr-5'>
                <Text className='text-neutral-50 font-medium'>{error}</Text>
              </View>
            </Pressable>
          </MotiView>}
          <Button
            size='lg'
            isLoading={isLoading}
            onPress={handleEdit}
          >
            Confirmar Alterações
          </Button>
        </View>



      </View>
    </View>
  )
}

