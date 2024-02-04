import { Types } from "mongoose";
import { UserData } from "../../@types/User";
import { User } from "../../database/schemas/User";
import bcrypt, { hashSync } from 'bcrypt'

export async function thisUserExists(id: string | null, email?: string) {
    if (id) {
        const exists = await User.exists({ _id: id })

        return !!exists
    } else if (email) {
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
                accessLevel: userRegistered.accessLevel
            }

            resolve(dataToReturn)
        })
    })
}

export function deleteUser(id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        const exists = await thisUserExists(id)

        if (!exists) {
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

type UpdateData = {
    [K in keyof Omit<UserData, '_id'>]?: UserData[K]
}

export async function updateUser(id: Types.ObjectId, updateData: UpdateData) {

    return new Promise((resolve, reject) => {
        let hashPassword = ''

        if (updateData.password) {
            hashPassword = hashSync(updateData.password, 10)
            
            User.findOneAndUpdate({ _id: id }, { password: hashPassword, ...updateData })
                .then((data) => {
                    data?.save().then((d) => resolve(d))
                    .catch((err) => reject(err))
                })
                .catch((err) => reject(err))
            return
        }

        User.findOneAndUpdate({ _id: id }, { ...updateData })
        .then((data) => {
            data?.save()
            resolve(true)
        })
        .catch((err) => reject(err))

    })
}
