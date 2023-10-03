import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons"

export default function Settings() {
  return (
    <View className='w-full h-full '>
      <View className='mb-2 mx-5'>
        <Text className='text-3xl font-bold'>Definições</Text>
      </View>
      <View className='h-0.5 w-full bg-neutral-100 mb-4'/>
      <View className='space-y-4 justify-center mx-5'>
        <Pressable className='flex-row space-x-2 items-center'>
          <FontAwesome5 name="user-edit" size={21} color="black" />
          <Text className='text-lg font-medium'>Editar Perfil</Text>
        </Pressable>
        <Pressable className='flex-row space-x-2 items-center'>
        <MaterialIcons name="logout" size={25} color="red" />
          <Text className='text-lg font-semibold text-red-500'>Logout</Text>
        </Pressable>
      </View>
    </View>
  )
}