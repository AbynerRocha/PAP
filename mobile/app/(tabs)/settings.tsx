import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { MaterialIcons } from "@expo/vector-icons"
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/Auth/AuthContext'
import { MotiView } from 'moti'
import { useRouter } from 'expo-router'

export default function Settings() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if(!user) return

  return (
    <View className='w-full h-full '>
      <View className='mb-2 mx-5'>
        <Text className='text-3xl font-bold'>Definições</Text>
      </View>
      <View className='h-0.5 w-full bg-neutral-100 mb-4' />
      <View className='space-y-4 justify-center mx-5 mb-3'>
        <View className='flex-row space-x-4 items-center'>
          <Avatar fallback={{ userName: user.name }} />
          <View className='flex-col w-[50%]'>
            <Text className='text-lg font-semibold'>{user.name}</Text>
            <Text className='text-xs text-neutral-400 break-words'>{user.email}</Text>
          </View>
          <Pressable 
            className='flex-row space-x-2 justify-end items-center'
            onPress={() => signOut().then(() => router.replace('/(auth)/landingpage'))}
          >
            <MaterialIcons name="logout" size={18} color="red" />
            <Text className='text-sm font-semibold text-red-500'>Logout</Text>
          </Pressable>
        </View>
      </View>
      <View className='h-0.5 w-full bg-neutral-100 mb-4' />

    </View>
  )
}