import { View, Text, KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { twMerge } from 'tailwind-merge'
import Button from '../../components/Button'
import { isValidEmail } from '../../utils/isValidEmail'

type Inputs = {
  email: string
  password: string
}

export default function Login() {
  const { control, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<Inputs>({ defaultValues: { email: '', password: '' } })
  const [showingKeyboard, setShowingKeyboard] = useState(false)

  useEffect(() => {
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => handleKeyboard('show'))
    Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => handleKeyboard('hide'));
  }, [])

  function handleKeyboard(state: 'show' | 'hide') {
    if (state === 'show') {
      setShowingKeyboard(true)
    } else {
      setShowingKeyboard(false)
    }
  }

  function onSubmit({ email, password }: Inputs) {
    if (!isValidEmail(email)) {
      setError('email', { message: 'O email inserido não é válido.' })
      return
    }

    clearErrors()
  }

  return (
    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className={twMerge('h-screen w-screen bg-neutral-50 space-y-5 items-center', (!showingKeyboard && ' justify-center transition duration-300 ease-linear'))}>
        <View className='w-[76%] space-y-1'>
          <Text className='text-neutral-950 font-bold text-4xl'>Login</Text>
          <Text className='text-neutral-400 font-medium font-lg'>Insira os seus dados abaixo para ter acesso a aplicação</Text>
        </View>
        <View className='h-[2px] w-[80%] bg-neutral-200' />
        <View className='w-full items-center'>
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (<View className='w-[76%] items-center space-y-2 mb-5'>
                <View className='w-full items-start '>
                  <Text className='text-neutral-600'>Email</Text>
                </View>
                <Input
                  className='border-b border-b-blue-700 w-full p-2'
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholderTextColor='rgb(190 190 190)'
                  placeholder='Digite aqui'
                />
                <View className='w-full items-start'>
                  {errors.email && errors.email.type !== 'required' && <Text className='text-sm text-red-600'>{errors.email.message}</Text>}
                  {errors.email && errors.email.type === 'required' && <Text className='text-sm text-red-600'>Este campo é obrigatório</Text>}
                </View>

              </View>
              )
            }}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (<View className='w-[76%] items-center space-y-1 mb-5'>
                <View className='w-full items-start '>
                  <Text className='text-neutral-600'>Email</Text>
                </View>
                <Input
                  className='border-b border-b-blue-700 w-full p-2'
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholderTextColor='rgb(190 190 190)'
                  placeholder='Digite aqui'
                />
              </View>
              )
            }}
          />
          <View className='w-full items-center'>
            <Button
              color='blue'
              onPress={() => {
                handleSubmit((data) => onSubmit(data))
              }}
            >
              Entrar
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}