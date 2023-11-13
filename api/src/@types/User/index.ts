import { Schema, Types } from "mongoose"

export type AccessLevel = 1 | 2 | 3

export type UserData = {
    _id: Types.ObjectId
    name: string
    email: string
    password: string
    avatar?: string
    accessLevel: AccessLevel
    createdAt: Date
    verified?: boolean
    emailCode?: string
}

