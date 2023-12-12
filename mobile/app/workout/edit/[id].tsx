import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Api } from '../../../utils/Api'
import { WorkoutData } from '../../../@types/Workout'

type Params = {
  id: string
}

export default function Workout() {
  const { id } = useLocalSearchParams<Params>()
  const [data, setData] = useState<WorkoutData>()

  useEffect(() => {
    Api.get(`/workout?id=${id}`)
    .then((res) => {
      setData(res.data.workout)
    })
  }, [])

  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}