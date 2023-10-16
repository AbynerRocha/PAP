import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { MotiText } from 'moti'

export default function Loading() {
  return (
    <View className='h-full w-full items-center justify-center space-y-4'>
        <ActivityIndicator size={60} color='black' />
        <MotiText 
          className='font-bold text-center text-2xl text-neutral-950'
          from={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            loop: true,
            duration: 1200,
            type: 'timing'
          }}
        >
          Carregando dados...
        </MotiText>
    </View>
  )
}