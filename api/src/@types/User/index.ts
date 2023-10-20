import { Schema, Types } from "mongoose"

export type UserData = {
    _id: Types.ObjectId
    name: string
    email: string
    password: string
    avatar?: string
    accountType: 1 | 2 | 3
    createdAt: Date
    verified?: boolean
    emailCode?: string
}

