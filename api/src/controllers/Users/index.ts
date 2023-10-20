import { Types } from "mongoose";
import { UserData } from "../../@types/User";
import { User } from "../../database/schemas/User";
import bcrypt from 'bcrypt'

export async function getAllUsers() {
    const user = await User.find()
    return user
}

export async function thisUserExists(id: string | null, email?: string) {
    if(id) {
        const exists = await User.exists({ _id: id })

        return !!exists
    } else if(email) {
        const exists = await User.exists({ email })

        return !!exists
    }

    return false
}

export function addUser(user: Omit<UserData, '_id'>) {
    return new Promise<Omit<UserData, 'password'>>(async (resolve, reject) => {
        const exists = await thisUserExists(null, user.email)

        if (exists) {
            reject({
                error: 'USER_IS_ALREADY_REGISTERED',
                status: 400,
                message: 'Este email já está a ser utilizado.'
            })
            return
        }

        const { password, ...userWithouPass } = user
        
        const hashPass = bcrypt.hashSync(password, 10)

        const userRegistered = new User({ password: hashPass, ...userWithouPass })

        userRegistered.save().then(() => {
            const dataToReturn = {
                _id: userRegistered._id,
                name: userRegistered.name,
                email: userRegistered.email,
                avatar: userRegistered?.avatar,
                createdAt: userRegistered.createdAt,
                accountType: userRegistered.accountType
            }

            resolve(dataToReturn)
        })
    })
}

export function delUser(id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        const exists = await thisUserExists(id)
    
        if(!exists) {
            reject({
                error: 'USER_NOT_FOUND',
                status: 404,
                message: 'Não foi possivel realizar está ação.'
            })
            return
        }

        User.deleteOne({ _id: id })
        .then(() => resolve(true))
        .catch((err) => reject({
            error: err.message,
            status: 500,
            message: 'Não foi possivel realizar está ação.'
        }))
    })
}

