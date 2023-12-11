import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, Vibration } from 'react-native'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Api } from '../../utils/Api'
import { WorkoutData } from '../../@types/Workout'
import { AxiosResponse } from 'axios'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet'
import { Actionsheet, useDisclose } from 'native-base'

type Response = {
  workouts: WorkoutData[]
}

export default function UserWorkouts() {
  const { user } = useAuth()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })
  const [page, setPage] = useState(1)
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutData>()

  const { isOpen, onOpen, onClose } = useDisclose()

  const { showActionSheetWithOptions } = useActionSheet()

  useEffect(() => {
    Api.get(`/workout?p=${page}&cb=${user?._id}`)
      .then((res: AxiosResponse<Response>) => {
        setWorkouts(res.data.workouts)
      })
  }, [])

  return <View className='flex-1'>
    <ScrollView className='flex-1'>
      {workouts.map((workout, idx) => {
        const difficulty = calcWorkoutDifficulty(workout.exercises)

        function renderDifficulty() {
          let maxDifficulty = 5
          let tempDifficulty = difficulty

          const JSX: React.ReactNode[] = []

          while (maxDifficulty != 0) {
            if (tempDifficulty > 0) {
              JSX.push(<FontAwesome5 key={maxDifficulty} name="dumbbell" size={13} color="black" />)
              tempDifficulty = tempDifficulty - 1
              maxDifficulty = maxDifficulty - 1
            } else {

              JSX.push(<FontAwesome5 key={maxDifficulty} name="dumbbell" size={13} color="rgb(212 212 212)" />)
              maxDifficulty = maxDifficulty - 1
            }
          }

          return JSX
        }

        return <Pressable
        onLongPress={() => {
          setWorkoutSelected(workout)
            Vibration.vibrate(350)

            
            onOpen()
          }}
          key={idx}
          className='m-3 h-20 p-2 rounded-lg border border-neutral-300'
        >
          <View className='w-full h-full justify-between'>
            <Text className='font-semibold'>{workout.name}</Text>
            <View className='flex-row space-x-1 justify-between'>
              <View className='flex-row space-x-1'>
                {renderDifficulty()}
              </View>

              <View className='flex-row items-center space-x-1'>
                <Ionicons name="cloud-download-outline" size={13} color="rgb(160 160 160)" />
                <Text className='text-xs text-neutral-400'>{formatter.format(workout.saves + 10000)}</Text>
              </View>
            </View>
          </View>
        </Pressable>
      })}
    </ScrollView>
    <Actionsheet isOpen={isOpen} onClose={() => {
      setWorkoutSelected(undefined)
      onClose()
    }}>
      {workoutSelected}
      <Actionsheet.Content>
        <View>
          <Text>Editar </Text>
        </View>
        <Actionsheet.Item startIcon={<Ionicons name='md-pencil-sharp' size={18} color='gray' />}>
          <Text className='font-medium'>Editar</Text>
        </Actionsheet.Item>
        <Actionsheet.Item startIcon={<Ionicons name='md-trash' size={18} color='red' />}>
          <Text className='text-red-500 text-md font-medium'>Remover</Text>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  </View>
}