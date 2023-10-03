import { View, Text, Platform } from 'react-native'
import React, { useState } from 'react'
import { Slot, Tabs } from 'expo-router'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Home from './(tabs)/home'
import { AnimatePresence, MotiView } from 'moti'
import { AuthProvider } from '../contexts/Auth/AuthContext'

export default function Layout() {
  const [tab, setTab] = useState<React.ReactNode>(<Home />)
  const [makeAnim, setMakeAnim] = useState(true)

  function handleChangeTab(component: React.ReactNode) {
    setMakeAnim(false)

    setTimeout(() => {
      setMakeAnim(true)
    }, 100)

    setTab(component)
  }

  return (
    <AuthProvider>
      <View className={Platform.OS === 'android' ? 'mt-10 h-screen w-screen' : 'h-screen w-screen'}>
        <Header />
        <Navbar onSelectTab={handleChangeTab} />
        {makeAnim &&
          <AnimatePresence exitBeforeEnter>
            <MotiView
              className='h-full w-full mt-7'
              from={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              onDidAnimate={() => setMakeAnim(true)}

            >
              {tab}
            </MotiView>
          </AnimatePresence>
        }
      </View>
    </AuthProvider>
  )
}