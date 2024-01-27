import { View, Text, Dimensions, TouchableOpacity, Pressable, Vibration, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from "react-native-chart-kit-chz"
import { ExerciseRecordUser, WorkoutData } from '../../@types/Workout'
import dayjs from 'dayjs'
import Button from '../../components/Button'
import { Entypo } from '@expo/vector-icons';
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { MotiView } from 'moti'
import BarChart from '../../components/Chart/Bar'
import { useQuery } from 'react-query'
import { Api } from '../../utils/Api'

type Response = {
  data: {
    date: Date
    workout: WorkoutData
  }[]
}

export default function Perfil() {
  const { user } = useAuth()
  const screenWidth = Dimensions.get('window').width

  const { data, isFetching: isFetchingFrequency, isLoading: isLoadingFrequency, error: errorFrequency } = useQuery({
    queryFn: async () => {
      const res = await Api.get<Response>(`/user/frequency?uid=${user?._id}`)

      return organizeData(res.data.data)
    }
  })

  function organizeData(unordained: { date: Date, workout: WorkoutData }[]) {
    const result: { label: string, value: number }[] = []

    unordained.forEach(({ date }) => {
      if(result.find(v => v.label === dayjs(date).format('MMM/YY'))) return

      const count = unordained.filter(v => dayjs(v.date).isSame(date, 'month')).length

      result.push({  
        label: dayjs(date).format('MMM/YY'),
        value: count
      })
    })

    return result
  }

  function renderName() {
    let name = user?.name

    name?.length! > 20 ? name = name?.slice(0, 20) : false
    name?.includes(' ') ? name = name.split(' ')[0] + ' ' + name.split(' ')[1][0] + '.' : false

    return name
  }
  
  return (
    <View className='bg-blue-800 h-full w-full'>
      <View className='w-full h-28 bg-slate-50' />
      <View className='flex-1 bg-slate-50'>
        <Text className='text-xl font-medium text-center'>Frequência</Text>
        {
          isFetchingFrequency || isLoadingFrequency
            ? <View className='items-center mt-10  h-[150px]'>
              <ActivityIndicator size='large' color='black' />
            </View>
            : errorFrequency
              ? <View className='items-center mt-10 h-[150px]'>
                <Text>Não foi possivel carregar este dado</Text>
              </View>
              : <View className='flex-row items-center mt-10  '>
                <Text className='-rotate-90 -mr-7 text-slate-400 text-xs'>N. de treinos</Text>
                <BarChart
                  data={data ? data : []}
                  height={150}
                  width={screenWidth}
                  barWidth={25}
                  labelSize={11}
                  animated
                />
              </View>
        }

        <View className='w-full h-[1] bg-slate-200 mt-0.5' />

      </View>
      <View
        className='absolute top-0 bg-blue-800 w-full h-24 items-start justify-center px-3'
      >
        <Avatar
          fallback={{ userName: user?.name! }}
          className='h-20 w-20 border-slate-50 border-2 absolute -bottom-4 left-2'
          textClass='text-3xl'
        />
        <View className='h-fit w-[75%] absolute -bottom-0 left-24 justify-end'>
          <Text className='text-slate-50 text-xl font-medium'>{renderName()}</Text>
          {/* <Text className='text-slate-50 text-xs font-light'>Membro desde: {dayjs(user?.createdAt!).format('DD [de] MMM[.] [de] YYYY')}</Text> */}
        </View>
      </View>
    </View>
  )
}
