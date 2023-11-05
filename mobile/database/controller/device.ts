import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'
import { LocalStorage } from '../keys'

export async function generateID() {
    const deviceId = uuid.v4().toString()

    AsyncStorage.setItem(LocalStorage.DEVICE.ID, deviceId)
    .catch((err) => console.error(err))    
}

export async function getId() {
    let deviceId = await AsyncStorage.getItem(LocalStorage.DEVICE.ID)

    if(deviceId === null) {
        generateID()
        deviceId = await AsyncStorage.getItem(LocalStorage.DEVICE.ID)
    }

    return deviceId
}

export async function isFirstLaunch() {
    try {
        const hasLaunched = await AsyncStorage.getItem(LocalStorage.DEVICE.FIRST_LAUNCH)

        if(hasLaunched === null) {
            AsyncStorage.setItem(LocalStorage.DEVICE.FIRST_LAUNCH, 'true')
            return true
        }
        
        return false
    } catch (error) {
        return false
    }
}
