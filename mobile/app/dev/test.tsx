import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Input from '../../components/Input'
import { MotiView, useAnimationState } from 'moti'
import { Accordion, Divider, Menu } from 'native-base'
import Button from '../../components/Button'


export default function Test() {
  const [show, setShow] = useState(false)
  const array = ['Teste 1', 'Teste 2', 'Teste 3']

  return (
    <View className='flex-1 items-center justify-center'>
      <View className='flex-col w-full h-full space-y-2'>
        <Accordion>
          <Accordion.Item>
            <Pressable
              className={'text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center'}
            >
              <View className='flex-1 flex-row space-x-2 items-center'>
                <Text className='text-md font-medium'>Teste</Text>
              </View>
              <View>
                <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
              </View>
            </Pressable>
          <Accordion.Details>
            <Text>Yesye</Text>
          </Accordion.Details>
          </Accordion.Item>
        </Accordion>
      </View>
    </View>
  )
}