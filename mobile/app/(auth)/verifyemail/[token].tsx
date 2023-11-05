import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import axios, { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../../components/Input'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Button from '../../../components/Button'
import { Api } from '../../../utils/Api'
import { MotiView } from 'moti'

type Params = {
  token: string
}

type Fields = {
  password: string
  confirmPassword: string
}

export default function RecoveryPassword() {
  const { token } = useLocalSearchParams<Params>()
  const { control, handleSubmit, formState: { errors }, setError } = useForm<Fields>()
  const [showingPassword, setShowingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function ErrorPage({ message }: { message: string }) {

    return <View className='h-screen w-screen items-center justify-center'>
      <View>
        <View className='rounded-full border-2 border-red-500'>
          <MaterialIcons name='error' size={40} color='red' />
        </View>
      </View>
    </View>
  }

  async function validateToken() {
    try {
      const res = Api.post('token/link/r-pass', { token })
      console.log((await res).data);
      
    } catch (error: any) {
        if(error.response.data.error) {
            return <ErrorPage
              message='Token inválido'
            />
        }
    }
  }

  function handleChangePassword(password: string) {
    return new Promise((resolve, reject) => {
      Api.put(`/user/recovery-pass/c`, { password }, { headers: { Authorization: token }})
      .then((res) => {
        
      })
      .catch((err: AxiosError<any>) => {
        setError('root', { message: err.response?.data.message })
      })
    })
  }

  function onSubmit(password: string) {
    setIsLoading(true)

    handleChangePassword(password)
    .finally(() => {
      setIsLoading(false)
    })
  }

  useEffect(() => {
    validateToken()
  }, [])

  return (
    <View className='h-full w-full items-center justify-center space-y-4'>
      
    </View>
  )
}