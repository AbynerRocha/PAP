import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Input from '../../components/Input'
import { MotiView, useAnimationState } from 'moti'
import { Accordion, Divider, Menu } from 'native-base'
import Button from '../../components/Button'
import Alert from '../../components/Alert'


export default function Test() {
  const [show, setShow] = useState(false)
  const array = ['Teste 1', 'Teste 2', 'Teste 3']

  return (
    <View>
      <Alert onClose={() => {}} show>T</Alert>
    </View>
  )
}