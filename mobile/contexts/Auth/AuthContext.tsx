import React, { createContext, useContext, useState } from "react";
import axios from 'axios'
import { saveUserDataToStorage } from "../../database/controller/user";
import { UserData } from "../../@types/User";

export type AuthContextData = {
    user: UserData | null
    refreshToken: string
    authToken: string
    signIn: (email: string, password: string) => Promise<any>
    signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL!

const AuthProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
    const [user, setUser] = useState<UserData | null>(null)
    const [refreshToken, setRefreshToken] = useState('')
    const [authToken, setAuthToken] = useState('')

    function signIn(email: string, password: string) {
        type Response = {
            user: UserData,
            refreshToken: string
            authToken: string
        }

        return new Promise(async (resolve, reject) => {
            try {
                const req = await axios.post<Response>(backendUrl, { email, password })
                const { user, authToken, refreshToken } = req.data

                saveUserDataToStorage({ name: user.name, email: user.email, accessLevel: user.accountType, authToken, refreshToken })
                setUser(req.data.user)
                setAuthToken(authToken)
                setRefreshToken(refreshToken)

                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }

    function signOut() {
        return new Promise((resolve, reject) => {

        })
    }

    return <AuthContext.Provider value={{ user, signIn, signOut, refreshToken, authToken }}>
        {children}
    </AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) throw new Error('Utilize o AuthProvider')

    return context
}

export { useAuth, AuthProvider }