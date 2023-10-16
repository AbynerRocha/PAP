import { View, Text } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type AvatarProps = {
  fallback?: { userName: string }
  className?: string
}

export default function Avatar({ fallback, className }: AvatarProps) {
  return (
    <View className={twMerge('bg-blue-800 rounded-full w-14 h-14 items-center justify-center', className)}>
      <Text className='text-2xl font-bold text-neutral-50'>{fallback && fallback.userName[0].toUpperCase()}</Text>
    </View>
  )
}