import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExerciseRecordUser, WorkoutData } from "../../@types/Workout";
import { LocalStorageKeys } from "../keys";

export type WorkoutLocalStorageData = WorkoutData & {}

export type HistoryLocalStorageData = {
    date: Date
    workout: WorkoutData
}

class History {
    private key: string;

    constructor() {
        this.key = LocalStorageKeys.WORKOUT.HISTORY
    }

    async add(workout: WorkoutData, date: Date) {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) {
                AsyncStorage.setItem(this.key, JSON.stringify([{ workout, date }]))
                return
            }

            const history: HistoryLocalStorageData[] = JSON.parse(data)

            history.push({ workout, date })

            AsyncStorage.setItem(this.key, JSON.stringify(history))
            return true
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async get() {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) return null

            const history: HistoryLocalStorageData[] = JSON.parse(data)

            return history
        } catch (error: any) {
            throw new Error(error)
        }
    }
}

class WorkoutLocalStoraged {
    private key: string

    constructor() {
        this.key = LocalStorageKeys.WORKOUT.WORKOUTS_SAVED
    }

    async save(workout: WorkoutData) {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) {
                AsyncStorage.setItem(this.key, JSON.stringify([workout]))
                return
            }

            const workouts: WorkoutLocalStorageData[] = JSON.parse(data)

            if (workouts.find(w => w._id === workout._id)) throw new Error('Este exercício já está salvo.')

            workouts.push(workout)

            AsyncStorage.setItem(this.key, JSON.stringify(workouts))
            return true
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async remove(workoutId: string) {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) throw new Error('There is no data saved')

            const workouts: WorkoutLocalStorageData[] = JSON.parse(data)
            const filtered = workouts.filter(w => w._id !== workoutId)

            AsyncStorage.removeItem(this.key)
            AsyncStorage.setItem(this.key, JSON.stringify(filtered))
            return true
        } catch (error: any) {
            throw new Error(error)
        }
    }

    async get() {
        try {
            const data = await AsyncStorage.getItem(this.key)

            if (data === null) return null

            const workouts: WorkoutLocalStorageData[] = JSON.parse(data)

            return workouts
        } catch (error: any) {
            throw new Error(error)
        }
    }
}

class UserExerciseStats {
    private key: string

    constructor(exerciseId: string) {
        this.key = LocalStorageKeys.STATS.replace('{{id}}', exerciseId)
    }


    public async get() {
        try {
            const storaged = await AsyncStorage.getItem(this.key)

            if (storaged === null) return null

            const data: ExerciseRecordUser[] = JSON.parse(storaged)

            return data
        } catch (error) {
            return null
        }
    }

    public async add(data: ExerciseRecordUser) {
        try {
            const storaged = await this.get()

            if (storaged === null) {
                AsyncStorage.setItem(this.key, JSON.stringify([{ ...data }]))
                return
            }

            AsyncStorage.setItem(this.key, JSON.stringify([...storaged, { ...data }]))
        } catch (error) {
            return null
        }
    }
}

export { History, WorkoutLocalStoraged, UserExerciseStats }
