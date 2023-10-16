import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function Loading() {
  return (
    <View className='h-full w-full items-center justify-center'>
        <ActivityIndicator size={50} color='black' />
    </View>
  )
}