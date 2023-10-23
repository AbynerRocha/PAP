import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { backendUrl } from '../../../contexts/Auth/AuthContext'
import { Controller, useForm } from 'react-hook-form'

type Params = {
  token: string
}

export default function RecoveryPassword() {
  const { token } = useLocalSearchParams<Params>()

  const { control, formState: { errors } } = useForm()

  async function validateToken() {
    try {
      axios.post(backendUrl + 'token/link/r-pass', { token })
    } catch (error: any) {
      console.error(error.response);
    }
  }

  useEffect(() => {
    validateToken()
  }, [])

  return (
    <View className='h-full w-full items-center justify-center'>
      <View className='space-y-1'>
        <Text className='text-neutral-950 font-bold text-3xl'>Trocar Senha</Text>
        <Text className='text-neutral-500 font-medium text-md'>Digite abaixo a sua nova senha!</Text>
      </View>

      <View>
      </View>
    </View>
  )
}