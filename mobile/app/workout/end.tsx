
import { View, Text } from 'react-native'
import React from 'react'
import { UserExerciseStats } from '../../database/controller/workout'

export default function WorkoutEnd() {
  
  const UserStats = new UserExerciseStats('6588a62e8cba287f13525fb9')
  
  UserStats.get().then((value) => {
    console.warn(value)
  })

  return (
    <View>
      <Text>WorkoutEnd</Text>
    </View>
  )
}
