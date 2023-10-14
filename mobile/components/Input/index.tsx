import { View, Text, TextInputProps, TextInput } from 'react-native'
import React from 'react'

type InputProps = TextInputProps & {}

export default function Input({className, ...rest}: InputProps) {
  return <TextInput 
  className={className}
    {...rest}
  />
}