import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useRouter } from 'expo-router'
import Calendar from '../../components/Calendar'


export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <View className='flex-1 space-y-3'>
      <View className='ml-4 w-[88%]'>
        <Text className='text-3xl font-bold text-neutral-950'>Organize os seus Treinos e acompanhe a sua Evolução</Text>
      </View>

      {/* Calendario */}
      
    </View>
  )
}