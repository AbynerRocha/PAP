import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useApp } from '../contexts/App/AppContext'
import { AnimatePresence, MotiView } from 'moti'
import Header from '../components/Header'
import Navbar from '../components/Navbar'

export default function App() {
  const { getTabComponent } = useApp()
  const [makeAnim, setMakeAnim] = useState(true)

  useEffect(() => {
    setMakeAnim(false)

    setTimeout(() => {
      setMakeAnim(true)
    }, 100)
  }, [getTabComponent])

  const tab = getTabComponent()

  return (
    <View className='h-full w-full'>
      <Header />
      <Navbar/>
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
    </View>
  )
}