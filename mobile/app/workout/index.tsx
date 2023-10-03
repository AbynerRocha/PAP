import { View, Text, Pressable, ScrollView, FlatList } from 'react-native'
import React, { useRef } from 'react'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer } from 'react-native-draggable-flatlist';

export default function Workout() {
  const router = useRouter()

  return (
    <View className='h-screen w-screen bg-neutral-100'>
      <MotiView
        from={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
      >
        {/* Footer */}
        <View className='h-44 w-full'>
          <LinearGradient
            colors={['#00229a', '#0038ff', '#0038ff', '#0487ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 0, 0.3, 1]}
            className='h-full w-full'
          >
            <Pressable className='p-5' onPress={() => {
              router.back()

            }}>
              <FontAwesome name='arrow-left' color='white' size={20} />
            </Pressable>
            <View className='flex-1 items-center '>
              <Text className='text-neutral-50 italic text-center font-extrabold text-2xl'>Peito e Tríceps</Text>
              <Text className='text-neutral-50 italic text-center'>Segunda-Feira</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Content */}
        <View className='flex flex-1'>
          <View className='space-y-2 items-center mt-2'>
            
          </View>
        </View>


        {/* Header */}
        <View></View>
      </MotiView>
    </View>
  )
}