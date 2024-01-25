import { View, Text } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

export default function ErrorPage({ message }: { message: string }) {
  return (
    <View className='h-[80%] w-full items-center justify-center bg-neutral-50 flex flex-col space-y-2'>
      <Feather name='x-circle' color='red' size={50} />
      <Text className='text-md text-red-500'>{message}</Text>
    </View>
  )
}