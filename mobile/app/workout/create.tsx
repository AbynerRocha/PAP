import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Input from '../../components/Input'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { useRouter } from 'expo-router';
import { ExerciseData } from '../../@types/Exercise';
import ExercisesList from './exerciseslist';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist'
import { twMerge } from 'tailwind-merge';

type Fields = {
  name: string
}


export default function CreateWorkout() {
  const { formState: { errors }, control, setError, handleSubmit } = useForm<Fields>()
  const router = useRouter()
  const [showExerciseList, setShowExerciseList] = useState(false)
  const [exercises, setExercises] = useState<ExerciseData[]>([])


  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...exercises]; // Don't modify react data in-place
    const removed = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed[0]); // Now insert at the new pos
    setExercises(copy);
  }

  return showExerciseList ? <ExercisesList
    onStateChange={setShowExerciseList}
    onExercisesChange={setExercises}
    exercises={exercises}
  /> : (
    <View className='h-screen w-screen'>

      <View className='px-3 pt-2 mb-4 mt-3'>
        <View className='flex-row w-full mb-3'>
          <Pressable
            onPress={() => router.back()}
          >
            <Ionicons name='chevron-back' color='black' size={30} />
          </Pressable>
          <View className='flex-1 items-center justify-center -ml-4'>
            <Text
              className='text-2xl italic font-bold text-center'
            >
              Criar um novo treino
            </Text>
          </View>
        </View>

        <Controller
          control={control}
          name='name'
          render={({ field: { value, name, onBlur, onChange } }) => {
            return (
              <View className='space-y-2'>
                <Text className='text-sm text-neutral-500'>Nome</Text>
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder='Digite aqui'
                  placeholderTextColor='rgb(163 163 163)'
                  className='bg-transparent border border-neutral-300 p-3 rounded-lg text-md'
                />
                {errors.name && <span className='text-red-500 text-sm mt-2'>{errors.name.message}</span>}
              </View>
            )
          }}
        />
        <View className='w-full items-end justify-center mt-3'>

        </View>
      </View>

      <View
        className='w-full h-[1px] bg-neutral-300'
      />
      <View
        className='flex-1 w-full s'
      >
        <DragList
          data={exercises}
          onReordered={onReordered}
          keyExtractor={(data: ExerciseData) => data._id}
          renderItem={(data: DragListRenderItemInfo<ExerciseData>) => {
            return (
              <Pressable
                key={data.index}
                className={twMerge('text-lg text-center p-3 flex-row rounded-md my-2 mx-3 border border-neutral-300 items-center', (data.isActive && 'opacity-50'))}
                onPressIn={data.onDragStart}
                onPressOut={data.onDragEnd}
              >
                <View className='flex-1 flex-row space-x-2 items-center'>
                  <Image
                    source={{ uri: data.item.image }}
                    width={40}
                    height={40}
                  />
                  <Text className='text-md font-medium'>{data.item.name}</Text>
                </View>
                <View>
                  <MaterialCommunityIcons name='drag-vertical' size={24} color='rgb(212 212 212)' />
                </View>
              </Pressable>
            )
          }}
        />
      </View>

      <View
        className='w-full h-[1px] bg-neutral-300'
      />

      <View className='fixed bottom-3 w-full h-fit flex-col items-center justify-center space-y-2 mt-6'>
        <Pressable
          className='w-52 h-12 bg-blue-700 rounded-xl shadow-md shadow-black/50 flex-row space-x-2 items-center justify-center'
          onPress={() => setShowExerciseList(true)}
        >
          <View>
            <Feather name='plus' size={20} color='white' />
          </View>
          <Text className='text-neutral-50 font-bold'>Adicionar Exercício</Text>
        </Pressable>
        <View>
          <Button
            color='green'
            size='sm'
            textStyle='font-bold'
            className='w-52 h-12 shadow-md shadow-black/50'
          >
            Criar
          </Button>
        </View>
      </View>
    </View>
  )
}