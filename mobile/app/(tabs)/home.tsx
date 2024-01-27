import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons';


export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <View className='flex-1 space-y-3'>
      <View className='ml-4 w-[88%]'>
        <Text className='text-3xl font-bold text-slate-950'>Organize os seus Treinos e acompanhe a sua Evolução</Text>
      </View>
      
      <View className='mx-4 space-y-2'>
        <Text className='text-lg font-medium text-slate-900'>Sugestão de treino para iniciantes</Text>

        <View className='flex-row space-x-2 h-24'>
          <View className='bg-blue-800 rounded-2xl h-full w-54 p-3 items-center justify-center'>
            <Text className='text-slate-100 font-medium italic text-xl'>Plano de Treino Full-Body</Text>
          </View>
          <Pressable 
            className='w-20 h-full bg-blue-800 rounded-2xl p-3 items-center space-y-2'
            onPress={() => router.push('/calendar/create')}
          >
            <Text className='text-slate-50 font-semibold'>Criar</Text>
            <Feather name='edit' size={28} color='white' />
          </Pressable>
        </View>
      </View>
      
    </View>
  )
}