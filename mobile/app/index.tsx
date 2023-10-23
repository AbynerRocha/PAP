import { View, Text, StatusBar, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useApp } from '../contexts/App/AppContext'
import { AnimatePresence, MotiView } from 'moti'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/Auth/AuthContext'
import Loading from './loading'
import Modal from '../components/Modal'

export default function App() {
  const { getTabComponent } = useApp()
  const { isLoading } = useAuth()
  const [makeAnim, setMakeAnim] = useState(true)
  
  useEffect(() => {
    setMakeAnim(false)

    setTimeout(() => {
      setMakeAnim(true)
    }, 100)
  }, [getTabComponent])

  const tab = getTabComponent()

  if (isLoading) return <Loading />

  return (
    <View className='h-screen w-screen'>
        <Header />
        <Navbar />
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
            >
              {makeAnim && tab}
            </MotiView>

          </AnimatePresence>
        }
        <Modal.Background/>
    </View>
  )
}