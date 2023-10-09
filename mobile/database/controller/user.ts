import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeysStorage, LocalStorage } from "../keys";

export type UserLocalStorageData = {
    name: string
    email: string
    accessLevel: number
    refreshToken: string
    authToken: string
}

const userKey = LocalStorage.USER

export async function haveAnyDataStorage(key: string) {
    try {
        const data = await AsyncStorage.getItem(key)

        if(data === null) return false

        return true
    } catch (error) {
        return false
    }
}

export async function getUserDataStoraged() {
    try {
        const data = await AsyncStorage.getItem(userKey)
        if(data === null) throw new Error("This key '"+userKey+"' dont have any data")

        const userLocalData: UserLocalStorageData = JSON.parse(data)

        return userLocalData
    } catch (error: any) {
        throw new Error(error)
    }
}

export async function saveUserDataToStorage(data: UserLocalStorageData) {
    try {
        AsyncStorage.setItem(userKey, data.toString())

        return true
    } catch(error: any) {
        throw new Error(error)
    }
}

export async function deleteUserDataFromStorage() {
    try {
        AsyncStorage.removeItem(userKey)

        return true
    } catch(error: any) {
        throw new Error(error)
    }
}
