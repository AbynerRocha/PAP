import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../../contexts/Auth/AuthContext';

export default function Header() {
    const userHour = new Date().getHours()
    const { user } = useAuth()

    return (
        <View className='w-full h-20 flex-row items-center space-x-3'>
            <View className='w-14 h-14 rounded-full bg-neutral-200 items-center justify-center ml-4 mt-5'>
                <FontAwesome
                    name='user'
                    size={36}
                    color='rgb(163 163 163)'
                />

            </View>
            <View className='mt-4'>
                <Text className='text-neutral-900 text-md text-lg'>{
                    userHour > 5 && userHour < 12
                        ? 'Bom dia,' : userHour >= 12 && userHour <= 18
                            ? 'Boa Tarde,' : 'Boa noite,'
                }</Text>
                <Text className='text-neutral-900 text-xl font-bold'>{user.name}</Text>
            </View>
        </View>
    )
}