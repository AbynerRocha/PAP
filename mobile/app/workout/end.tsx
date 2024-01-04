
import { View, Text } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { MotiView, useAnimationState } from 'moti';

export default function WorkoutEnd() {
  const animation = useAnimationState({
    from: {
      rotate: '200deg'
    },
    to: {
      rotate: '0deg'
    }
  })

  return (
    <View className='flex-1 items-center justify-center space-y-2'>
      <MotiView
        state={animation}
        transition={{
          duration: 500
        }}
      >
        <AntDesign name="checkcircle" size={55} color="blue" />
      </MotiView>
      <Text className='font-semibold text-2xl text-center'>Treino finalizado com sucesso!</Text>
    </View>
  )
}
