import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import Header from '../../components/Header'
import Navbar from '../../components/Navbar'

export default function TabsLayout() {
  return (
    <View className='h-screen w-screen'>
      <Header />
      <Navbar />
      <Slot/>
    </View>
  )
}