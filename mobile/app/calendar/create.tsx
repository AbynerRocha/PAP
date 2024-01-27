import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import getDaysOfWeek from '../../utils/getDaysOfWeek'
import { twMerge } from 'tailwind-merge'
import { ExerciseInfo, WorkoutData } from '../../@types/Workout'
import { Feather } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import Input from '../../components/Input'
import { useAuth } from '../../contexts/Auth/AuthContext'
import Button from '../../components/Button'
import SavedWorkouts from './savedworkoutslist'
import WorkoutDifficulty from '../../components/WorkoutDifficulty'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import Alert from '../../components/Alert'

export default function CreateCalendar() {
  const router = useRouter()
  const { user } = useAuth()

  const [week, setWeek] = useState([
    { name: 'Domingo', value: 1 },
    { name: 'Segunda', value: 2 },
    { name: 'Terça', value: 3 },
    { name: 'Quarta', value: 4 },
    { name: 'Quinta', value: 5 },
    { name: 'Sexta', value: 6 },
    { name: 'Sábado', value: 7 },
  ])

  const [selected, setSelected] = useState(week[0].value)
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutData>()
  const [workouts, setWorkouts] = useState<{ value: number, workout: WorkoutData }[]>([])
  const [trainingPlanName, setTrainingPlanName] = useState(`Plano de treino de ${user?.name}`)
  const [isShowingSavedWorkouts, setIsShowingSavedWorkouts] = useState(false)
  const [error, setError] = useState<{ type: string, message: string }>({ type: '', message: '' })


  function numberOfSeries(exercises: ExerciseInfo[]) {
    let series = 0

    for(const info of exercises) {
      series = series+info.series.length
    }

    return series
  }

  function handleCreate() {
    if(trainingPlanName === '') {
      setError({
        type: 'name',
        message: 'Este campo é obrigatório.'
      })
      return
    } 

    if(workouts.length < 2) {
      setError({
        type: 'workouts',
        message: 'Você precisa selecionar pelo menos 2 treinos.'
      })
      return
    }
  }

  return isShowingSavedWorkouts ? <SavedWorkouts 
    onClose={() => setIsShowingSavedWorkouts(false)}
    onSelect={(data) => {
      const verify = workouts.find(w => w.value === selected)

      if(verify) {
        const filtered = workouts.filter(w => w.value !== selected)
        filtered.push({ value: selected, workout: data })

        setWorkouts(filtered)
        setWorkoutSelected(data)
        return
      }

      setWorkouts((v) => [...v, { value: selected, workout: data }])
      setWorkoutSelected(data)
    }} 
  /> : (
    <View className='flex-1'>
      <View className='flex-row space-x-4 items-center mt-3'>
        <Link href='/(tabs)/home'>
          <Feather name='chevron-left' size={35} color='black' />
        </Link>
        <Text className='text-3xl font-semibold '>Criar Plano de Treino</Text>
      </View>
      <View className='flex-1 items-center mt-8'>
        <View className='w-full mb-2'>
          <Text className={twMerge('mx-3 text-slate-500 mb-2', (error.type === 'name' && 'text-red-300'))}>Nome do plano</Text>
          <Input
            className={twMerge('w-[94%] mx-3 h-16 border border-slate-300 rounded-xl p-2', (error.type === 'name' && 'border-red-500'))}
            defaultValue={trainingPlanName}
            onChangeText={setTrainingPlanName}
          />
          {error.type === 'name' && <Text className='text-red-500 text-xs ml-3 mt-1'>{error.message}</Text>}
        </View>
        <View className='w-full h-24'>
          <ScrollView horizontal className='p-3 space-x-2 w-full h-20'>
            {week.map((day, idx, array) => {
              return <Pressable
                key={idx}
                className={twMerge(
                  'border-blue-800 border h-16 w-16 rounded-full items-center justify-center p-1',
                  (idx === array.length - 1 && 'mr-5'),
                  (selected === day.value && 'bg-blue-800')
                )}
                onPress={() => {
                  if (selected === day.value) return
                  
                  setSelected(day.value)

                  const workout = workouts.find((w) => w.value === selected)

                  workout && setWorkoutSelected(workout.workout)
                }}
              >
                <Text className={twMerge('font-bold text-xs', (selected === day.value && 'text-slate-50'))}>{day.name}</Text>
              </Pressable>
            })}
          </ScrollView>
        </View>
      </View>
      <View className='h-[50%] justify-center'>
        {workouts.find((w) => w.value === selected)
          ? <View className='h-full w-full'>
            <View className='p-3'>
              <Text className='text-3xl font-semibold'>{workoutSelected?.name}</Text>
      
              <View className='flex-row items-center'>
                <Text className='text-lg'>Dificuldade Média: </Text>
                <WorkoutDifficulty size={14} className='flex-row space-x-1' difficulty={workoutSelected?.exercises ? calcWorkoutDifficulty(workoutSelected?.exercises) : 3} />
              </View>
              <Text className='text-lg'>Número de exercícios: {workoutSelected?.exercises.length}</Text>
              <Text className='text-lg'>Total de Séries: {numberOfSeries(workoutSelected?.exercises!)}</Text>
              <View className='flex-row space-x-2 items-center mt-3'>
                <Button onPress={() => setIsShowingSavedWorkouts(true)}>Trocar Treino</Button>
                <Button onPress={() => {
                  const filtered = workouts.filter(w => w.value !== selected)

                  setWorkouts(filtered)
                }} 
                color='red'
                >
                  Remover
                </Button>
              </View>
            </View>

          </View>
          : <Pressable className='flex-row space-x-2 justify-center items-center h-full w-full' onPress={() => setIsShowingSavedWorkouts(true)}>
            <Feather name='plus-circle' size={28} color='rgb(212 212 212 )' />
            <Text className='text-slate-300'>Selecionar Treino</Text>
          </Pressable>
        }
      </View>
      <View className='h-32 w-full items-center justify-center p-2'>
        <Button size='lg' textSize='lg' onPress={handleCreate}>Finalizar</Button>
      </View>

      {error.type === 'workouts' && <Alert show={true} onClose={() => setError({ type: '', message: '' })} >aaaaa</Alert>}
    </View>
  )
}