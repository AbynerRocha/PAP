import { View, Text, Platform, StatusBar } from 'react-native'
import React, { useEffect } from 'react'
import { QueryClientProvider } from 'react-query'
import { AuthProvider, useAuth } from '../contexts/Auth/AuthContext'
import { clientQuery } from '../utils/queryClient'
import { Slot, useRouter } from 'expo-router'
import { AppProvider } from '../contexts/App/AppContext'
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NativeBaseProvider } from "native-base";
import { useNetInfo } from '@react-native-community/netinfo'

export default function Layout() {
  return (
    <QueryClientProvider client={clientQuery}>
      <AppProvider>
        <AuthProvider>
          <View className={Platform.OS === 'android' ? 'mt-8 h-full w-full' : 'h-full w-full'}>
            <StatusBar barStyle='dark-content' backgroundColor='white' />
            <Slot />
          </View>
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  )
}