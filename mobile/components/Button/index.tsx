import { View, Text, PressableProps, Pressable } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonProps = PressableProps & { 
    children: string | React.ReactNode
    textStyle?: string
    className?: string
}

export default function Button({ children, className, textStyle, ...rest }: ButtonProps) {
  return (
    <Pressable
        className={twMerge('items-center justify-center',className)}
        {...rest}
    >
        <Text className={textStyle}>{children}</Text>
    </Pressable>
  )
}