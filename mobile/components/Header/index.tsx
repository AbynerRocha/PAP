import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/Auth/AuthContext';
import { Link, useRouter } from 'expo-router';
import Avatar from '../Avatar';

export default function Header() {
    const userHour = new Date().getHours()
    const { user } = useAuth()
    const router = useRouter()

    return (
        <View className='w-full h-20 flex-row items-center space-x-3'>
            {user ? <>
                <Pressable
                    className='w-14 h-14 rounded-full bg-neutral-200 items-center justify-center ml-4 mt-5'
                >
                    <Avatar fallback={{ userName: user.name }} />
                </Pressable>
                <View className='mt-4'>
                    <Text className='text-neutral-900 text-md text-lg'>{
                        userHour > 5 && userHour < 12
                            ? 'Bom dia,' : userHour >= 12 && userHour <= 18
                                ? 'Boa Tarde,' : 'Boa noite,'
                    }</Text>
                    <Text className='text-neutral-900 text-xl font-bold'>{user.name}</Text>
                </View>
            </> 
            : 
            <View className='h-full w-screen flex-row items-center  px-4 space-x-2'>
                <Link
                    className='bg-blue-800 py-3 px-5 rounded-xl'
                    href='/(auth)/landingpage'
                >
                    <Text className='text-neutral-50 font-semibold'>Entrar</Text>
                </Link>
            </View>
            }

        </View>
    )
}