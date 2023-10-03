import { Schema } from "mongoose"

export type UserData = {
    name: string
    email: string
    password: string
    avatar?: string
    accountType: 1 | 2 | 3
    createdAt: Date
}

