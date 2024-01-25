import { View, Text, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { LineChart } from "react-native-chart-kit-chz"
import { ExerciseRecordUser } from '../../@types/Workout'
import dayjs from 'dayjs'
import Button from '../../components/Button'
import { Entypo } from '@expo/vector-icons';
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/Auth/AuthContext'

dayjs().locale('pt-PT')

export default function Charts() {
  const { user } = useAuth()
  const screenWidth = Dimensions.get('window').width
  const now = new Date()

  const forcedName = 'Abyner Rocha'

  function renderName() {
    let name = forcedName

    name?.length! > 20 ? name = name?.slice(0, 20) : false
    name?.includes(' ') ? name = name.split(' ')[0] + ' ' + name.split(' ')[1][0] + '.' : false

    return name
  }

  return (
    <View className='bg-blue-800 h-full w-full'>
      <View className='flex-1 bg-neutral-50'>

      </View>
      <View
        className='absolute top-0 bg-blue-800 w-full h-24 items-start justify-center px-3'
      >
          <Avatar 
            fallback={{ userName: forcedName }}
            className='h-20 w-20 border-neutral-50 border-2 absolute -bottom-4 left-2'
            textClass='text-3xl'
          />
       <View className='h-fit w-[75%] absolute -bottom-0 left-24 justify-end'>
        <Text className='text-neutral-50 text-xl font-medium'>{renderName()}</Text>
       </View>

      </View>
    </View>
  )
}
