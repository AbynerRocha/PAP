import { View, Text } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type AvatarProps = {
  fallback?: { userName: string }
  className?: string
  textClass?: string
}

export default function Avatar({ fallback, className, textClass }: AvatarProps) {
  return (
    <View className={twMerge('bg-blue-800 rounded-full w-14 h-14 items-center justify-center', className)}>
      <Text className={twMerge('text-2xl font-bold text-slate-50', textClass)}>{fallback && fallback.userName[0].toUpperCase()}</Text>
    </View>
  )
}