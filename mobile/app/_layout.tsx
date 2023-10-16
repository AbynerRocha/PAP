import { View, Text, Platform } from 'react-native'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { AuthProvider, useAuth } from '../contexts/Auth/AuthContext'
import { clientQuery } from '../utils/queryClient'
import { Slot, Stack } from 'expo-router'
import { AppProvider } from '../contexts/App/AppContext'
import Loading from './loading'

export default function Layout() {
  const { isLoading } = useAuth()
  return (
    <QueryClientProvider client={clientQuery}>
        <AppProvider>
            <AuthProvider>
              <View className={Platform.OS === 'android' ? 'mt-10 h-screen w-screen' : 'h-screen w-screen'}>
                {isLoading ? <Loading/> : <Stack initialRouteName='/(auth)/' screenOptions={{ headerShown: false }}/>}
              </View>
            </AuthProvider>
        </AppProvider>
    </QueryClientProvider>
  )
}