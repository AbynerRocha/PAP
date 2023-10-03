import { UserData } from "../../@types/User";
import { User } from "../../database/schemas/User";

export async function getAllUsers() {
    const user = await User.find()
    return user
}

export function addUser(user: UserData) {
    return new Promise<Omit<UserData, 'password'>>(async (resolve, reject) => {
        const thisUserExists = await User.exists({ email: user.email })

        if (thisUserExists) {
            reject({
                error: 'USER_IS_ALREADY_REGISTERED',
                status: 400,
                message: 'Este email já está a ser utilizado.'
            })
            return
        }

        const userRegistered = new User(user)

        userRegistered.save().then(() => {
            const dataToReturn = {
                id: userRegistered._id,
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

