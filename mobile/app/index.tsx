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
import { Redirect } from 'expo-router'

export default function App() {
  const { getTabRoute} = useApp()
  const { isLoading } = useAuth()

  useEffect(() => {
    checkIfIsFirstLaunch()
  }, [])

  if (isLoading) return <Loading />

  async function checkIfIsFirstLaunch() {
    const firstLaunch = await isFirstLaunch()

    if(firstLaunch) {
      generateID()      
    }
  }

  return <Redirect href={getTabRoute()} />
}