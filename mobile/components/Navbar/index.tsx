import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useApp } from '../../contexts/App/AppContext'

export type Tabs = 'home' | 'workout' | 'evolution' | 'settings'

type NavbarProps = {
  onSelectTab?: (component: React.ReactNode) => void
}

export default function Navbar({ onSelectTab }: NavbarProps) {
  const [tabSelected, setTab] = useState<'home' | 'workout' | 'evolution' | 'settings'>('home')
  const { setTabSelected, tab } = useApp()

  const tabs: { name: string; key: 'home' | 'workout' | 'evolution' | 'settings' }[] = [
    { name: 'Inicio', key: 'home' },
    { name: 'Treinos', key: 'workout' },
    { name: 'Evolução', key: 'evolution' },
    { name: 'Definições', key: 'settings' },
  ]

  useEffect(() => {
    setTab(tab)
  }, [tab])

  return (
    <View className='flex-row h-18 w-full mt-4'>
      <ScrollView horizontal className='px-3 py-2 space-x-3'>
        {tabs.map((tab, idx, arr) => {
          return <Pressable
            key={tab.key}
            className={twMerge('px-4 py-1 h-9 items-center justify-center', (tabSelected === tab.key && 'bg-blue-800 rounded-3xl'), (idx === arr.length-1 && 'mr-8'))}
            onPress={() => {
              setTab(tab.key)
              setTabSelected(tab.key)
            }}
          >
            <Text className={twMerge('text-md font-semibold', (tabSelected === tab.key ? 'text-neutral-50' : 'text-neutral-950'))}>{tab.name}</Text>
          </Pressable>
        })}
      </ScrollView>
    </View>
  )
}