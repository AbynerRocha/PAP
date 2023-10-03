import React, { createContext, useContext, useState } from "react";

type UserData = {
    name: string
    email: string
}

export type AuthContextData = {
    user: UserData
    signIn: () => Promise<any>
    signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
    const [user, setUser] = useState<UserData>({ name: 'Utilizador', email: 'utilizador@evotraning.com' })
    
    function signIn() {
        return new Promise((resolve, reject) => {
            
        })
    }
    
    function signOut() {
        return new Promise((resolve, reject) => {

        })
    }

    return <AuthContext.Provider value={{ user, signIn, signOut }}>
        {children}
    </AuthContext.Provider>
}

const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context) throw new Error('Utilize o AuthProvider')

    return context
}

export { useAuth, AuthProvider }