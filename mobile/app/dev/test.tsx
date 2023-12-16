import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Input from '../../components/Input'
import { MotiView, useAnimationState } from 'moti'

export default function Test() {
  const [show, setShow] = useState(false)

  const showAnimation = useAnimationState({
    from: {
      opacity: 0, 
      translateY: -5
    },
    show: {
      opacity: 1, 
      translateY: 0
    }, 
    hide: {
      opacity: 0,
      translateY: -5
    }
  })

  return (
    <View className='flex-1 items-center justify-center'>
      <View className='flex-col w-full h-full space-y-2'>

        <Pressable
          className={'text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center'}
          onPress={() => {
            setShow((v) => !v)
            showAnimation.transitionTo(show ? 'show' : 'hide')
          }}
        >
          <View className='flex-1 flex-row space-x-2 items-center'>
            <Text className='text-md font-medium'>Teste</Text>
          </View>
          <View>
            <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
          </View>
          <MotiView 
            className='absolute top-14 left-2 bg-neutral-100 h-32 w-full border border-neutral-300 p-3 rounded-lg flex-row justify-around'
            state={showAnimation}
          >

            <View className='space-y-2 flex-col items-center'>
              <Text className='text-xs'>Números de repetições</Text>
              <Input 
                keyboardType='numeric'
                className='border border-neutral-700 rounded-lg w-14 p-2 text-center text-lg'
              />
            </View>
            <View className='space-y-2 flex-col items-center'>
              <Text className='text-xs'>Tempo de Descanso</Text>
              <View className='flex-col items-center space-y-1'>
                <Input 
                  keyboardType='numeric'
                  className='border border-neutral-700 rounded-lg w-16 p-2 text-center text-lg'
                />
                <Text>segundos</Text>
              </View>
            </View>
          </MotiView>
        </Pressable>
        <Pressable
          className={'text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center'}
          onPress={() => {
            setShow((v) => !v)
            showAnimation.transitionTo(show ? 'show' : 'hide')
          }}
        >
          <View className='flex-1 flex-row space-x-2 items-center'>
            <Text className='text-md font-medium'>Teste</Text>
          </View>
          <View>
            <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
          </View>
          <MotiView 
            className='absolute top-14 left-2 bg-neutral-100 h-32 w-full border border-neutral-300 p-3 rounded-lg flex-row justify-around'
            state={showAnimation}
          >

            <View className='space-y-2 flex-col items-center'>
              <Text className='text-xs'>Números de repetições</Text>
              <Input 
                keyboardType='numeric'
                className='border border-neutral-700 rounded-lg w-14 p-2 text-center text-lg'
              />
            </View>
            <View className='space-y-2 flex-col items-center'>
              <Text className='text-xs'>Tempo de Descanso</Text>
              <View className='flex-col items-center space-y-1'>
                <Input 
                  keyboardType='numeric'
                  className='border border-neutral-700 rounded-lg w-16 p-2 text-center text-lg'
                />
                <Text>segundos</Text>
              </View>
            </View>
          </MotiView>
        </Pressable>
        <Pressable
          className={'text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center'}
          onPress={() => {
            setShow((v) => !v)
            showAnimation.transitionTo(show ? 'show' : 'hide')
          }}
        >
          <View className='flex-1 flex-row space-x-2 items-center'>
            <Text className='text-md font-medium'>Teste</Text>
          </View>
          <View>
            <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
          </View>
          <MotiView 
            className='absolute top-14 left-2 bg-neutral-100 h-32 w-full border border-neutral-300 p-3 rounded-lg flex-row justify-around'
            state={showAnimation}
          >

            <View className='space-y-2 flex-col items-center'>
              <Text className='text-xs'>Números de repetições</Text>
              <Input 
                keyboardType='numeric'
                className='border border-neutral-700 rounded-lg w-14 p-2 text-center text-lg'
              />
            </View>
            <View className='space-y-2 flex-col items-center'>
              <Text className='text-xs'>Tempo de Descanso</Text>
              <View className='flex-col items-center space-y-1'>
                <Input 
                  keyboardType='numeric'
                  className='border border-neutral-700 rounded-lg w-16 p-2 text-center text-lg'
                />
                <Text>segundos</Text>
              </View>
            </View>
          </MotiView>
        </Pressable>

      </View>
    </View>
  )
}