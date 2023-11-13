
export type UserData = {
    _id: string
    name: string
    email: string
    avatar?: string
    accessLevel: 1 | 2 | 3
    createdAt: Date
    verified: boolean
}

