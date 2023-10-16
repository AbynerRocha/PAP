import { View, Text, Platform } from 'react-native'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { AuthProvider } from '../../contexts/Auth/AuthContext'
import { clientQuery } from '../../utils/queryClient'
import { Slot, Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <View className={Platform.OS === 'android' ? 'h-screen w-screen' : 'h-screen w-screen'}>
      <Slot />
    </View>
  )
}