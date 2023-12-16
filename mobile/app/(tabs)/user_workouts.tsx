import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, Pressable, Vibration, Alert, ActivityIndicator } from 'react-native'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { Api } from '../../utils/Api'
import { WorkoutData } from '../../@types/Workout'
import { AxiosError, AxiosResponse } from 'axios'
import calcWorkoutDifficulty from '../../utils/calcWorkoutDifficulty'
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Actionsheet, AlertDialog, useDisclose } from 'native-base'
import { useRouter } from 'expo-router'
import Button from '../../components/Button'
import { Feather } from '@expo/vector-icons'

type Response = {
  workouts: WorkoutData[]
}

export default function UserWorkouts() {
  const { user } = useAuth()
  const formatter = Intl.NumberFormat('pt', { notation: 'compact' })

  const [page, setPage] = useState(1)
  const [workouts, setWorkouts] = useState<WorkoutData[]>([])
  const [workoutSelected, setWorkoutSelected] = useState<WorkoutData>()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState({ type: '', message: '' })

  const actionSheet = useDisclose()
  const alertDialog = useDisclose()

  const cancelAlertDialogRef = useRef(null)

  const router = useRouter()

  useEffect(() => {
    fetchWorkout()
  }, [])

  function fetchWorkout() {
    setIsFetching(true)

    Api.get(`/workout?p=${page}&cb=${user?._id}`)
      .then((res: AxiosResponse<Response>) => {
        setWorkouts(res.data.workouts)
      })
      .catch((err: AxiosError<any>) => {
        console.log(err.request)
        switch (err.response?.data) {
          case 'NOT_FOUND':
            setError({ type: 'root', message: 'Sem exercícios' })
            break
          default:
            setError({ type: 'root', message: `Não foi possivel realizar está ação neste momento (${err.code})` })
            break
        }
      })
      .finally(() => setIsFetching(false))
  }

  function handleDeleteWorkout() {
    Api.delete(`/workout?id=${workoutSelected?._id}`)
      .then(() => {
        fetchWorkout()

        alertDialog.onClose()
        actionSheet.onClose()

        setWorkoutSelected(undefined)
      })
  }

  if (isFetching) return <View className='h-screen w-screen items-center justify-center bg-neutral-50'>
    <ActivityIndicator size='large' color='black' />
  </View>

  if (error.type === 'root') return <View className='h-[80%] w-full items-center justify-center bg-neutral-50 flex flex-col space-y-2'>
    <Feather name='x-circle' color='red' size={50} />
    <Text className='text-md text-red-500'>{error.message}</Text>
  </View>

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
            Vibration.vibrate(150)
            setWorkoutSelected(workout)

            actionSheet.onOpen()
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

    <Actionsheet isOpen={actionSheet.isOpen} onClose={() => {
      setWorkoutSelected(undefined)
      actionSheet.onClose()
    }}>
      <Actionsheet.Content>
        <View>
          <Text className='text-lg font-medium'>Gerir {workoutSelected?.name}</Text>
        </View>
        <View className='w-full h-0.5 bg-neutral-200 my-2' />
        <Actionsheet.Item
          startIcon={<MaterialIcons name="open-in-new" size={19} color="gray" />}
          className='rounded-xl active:bg-neutral-200 active:transition-all active:duration-300 active:ease-in-out'
          onPress={() => router.push(`/workout/${workoutSelected?._id}`)}
        >
          <Text className='font-medium'>Ver</Text>
        </Actionsheet.Item>
        <View className='w-full h-0.5 bg-neutral-200 my-2' />
        <Actionsheet.Item
          startIcon={<Ionicons name='md-pencil-sharp' size={18} color='gray' />}
          className='rounded-xl active:bg-neutral-200 active:transition-all active:duration-300 active:ease-in-out'
          onPress={() => router.push(`/workout/edit/${workoutSelected?._id}`)}
        >
          <Text className='font-medium'>Editar</Text>
        </Actionsheet.Item>
        <View className='w-full h-0.5 bg-neutral-200 my-2' />
        <Actionsheet.Item
          startIcon={<Ionicons name='md-trash' size={18} color='red' />}
          className='rounded-xl active:bg-neutral-200 active:transition-all active:duration-300 active:ease-in-out'
          onPress={() => {
            setWorkoutSelected(workoutSelected)

            alertDialog.onOpen()
          }}
        >
          <Text className='text-red-500 text-md font-medium'>Remover</Text>
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>

    <AlertDialog leastDestructiveRef={cancelAlertDialogRef} isOpen={alertDialog.isOpen} onClose={alertDialog.onClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>Remover {workoutSelected?.name}</AlertDialog.Header>
        <AlertDialog.Body>
          <View>
            <Text>
              Você tem certeza que quer apagar este treino?
              {workoutSelected && workoutSelected?.saves > 0 && <><Text className='font-medium'> {workoutSelected?.saves} utilizadores</Text> já salvaram este treino</>}
            </Text>
          </View>
        </AlertDialog.Body>
        <AlertDialog.Footer className='space-x-2'>
          <Button
            className='p-0 h-10 w-16'
            onPress={handleDeleteWorkout}
          >
            Sim
          </Button>
          <Button
            className='p-0 h-10 w-16'
            color='red'
            onPress={alertDialog.onClose}
          >
            Não
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  </View>
}