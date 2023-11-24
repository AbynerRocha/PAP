import { View, Text, StatusBar, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useApp } from '../contexts/App/AppContext'
import { AnimatePresence, MotiView } from 'moti'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/Auth/AuthContext'
import Loading from './loading'
import Modal from '../components/Modal'
import { generateID, isFirstLaunch } from '../database/controller/device'
import Home from './(tabs)/home'

export default function App() {
  const { getTabComponent } = useApp()
  const { isLoading } = useAuth()
  const [makeAnim, setMakeAnim] = useState(true)

  useEffect(() => {
    checkIfIsFirstLaunch()
  }, [])

  useEffect(() => {
    setMakeAnim(false)

    setTimeout(() => {
      setMakeAnim(true)
    }, 100)
  }, [getTabComponent])

  const tab = getTabComponent()

  if (isLoading) return <Loading />

  async function checkIfIsFirstLaunch() {
    const firstLaunch = await isFirstLaunch()

    if(firstLaunch) {
      generateID()      
    }
  }

  return <Home/>
}