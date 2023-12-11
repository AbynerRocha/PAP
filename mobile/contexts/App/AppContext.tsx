import React, { createContext, useContext, useState } from "react";
import { Tabs } from "../../components/Navbar";
import { getId } from "../../database/controller/device";

type BgTranslucentState = 'show' | 'hide'

type AppContextData = {
    tab: Tabs
    getTabRoute: () => string 
    setTabSelected: (tab: Tabs) => void
    getDeviceId: () => Promise<string>
}


const AppContext = createContext<AppContextData>({} as AppContextData)

function AppProvider({ children }: { children: React.ReactNode }) {
    const [tab, setTab] = useState<Tabs>('home')
    
    function getTabRoute() {
        switch(tab) {
            case 'home':
                return '/(tabs)/home'
            case 'evolution':
                return '/(tabs)/charts'
            case 'workout': 
                return '/(tabs)/workouts'
            case 'settings': 
                return '/(tabs)/settings'
            default:
                return '/(tabs)/home'
        }
    }

    function setTabSelected(tabs: Tabs) {
        setTab(tabs)
    }

    function disableNav() {
        
    }
    
    function enableNav() {

    }

    async function getDeviceId() {
        const deviceId = await getId()

        if(deviceId === null) throw new Error('There is no device ID. Generate one')

        return deviceId
    }

    return <AppContext.Provider value={{ tab, getTabRoute, setTabSelected, getDeviceId }}>
        {children}
    </AppContext.Provider>
}

function useApp() {
    const context = useContext(AppContext)

    if (!context) throw new Error('Utilize o AuthProvider')

    return context
}

export { AppProvider, useApp }