import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'
import Home from './home'
import { AnimatePresence, MotiView } from 'moti'
import { AuthProvider } from '../../contexts/Auth/AuthContext'
import { QueryClientProvider } from 'react-query'
import { clientQuery } from '../../utils/queryClient'
import { Slot } from 'expo-router'

export default function Layout() {
  const [tab, setTab] = useState<React.ReactNode>(<Home />)
  const [makeAnim, setMakeAnim] = useState(true)

  return (
    <View className={Platform.OS === 'android' ? 'mt-10 h-screen w-screen' : 'h-screen w-screen'}>
      <Header />
      <Navbar />
      <Slot />
    </View>
  )
}