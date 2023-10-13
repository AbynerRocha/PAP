import React, { createContext, useContext, useState } from "react";
import { Tabs } from "../../components/Navbar";
import Home from "../../app/(tabs)/home";
import Charts from "../../app/(tabs)/charts";
import Workouts from "../../app/(tabs)/workouts";
import Settings from "../../app/(tabs)/settings";

type AppContextData = {
    tab: Tabs
    getTabComponent: () => React.ReactNode 
    setTabSelected: (tab: Tabs) => void
}

const AppContext = createContext<AppContextData>({} as AppContextData)

function AppProvider({ children }: { children: React.ReactNode }) {
    const [tab, setTab] = useState<Tabs>('home')

    function getTabComponent() {
        switch(tab) {
            case 'home':
                return <Home/>
            case 'evolution':
                return <Charts />
            case 'workout': 
                return <Workouts />
            case 'settings': 
                return <Settings/>
            default:
                return <Home/>
        }
    }

    function setTabSelected(tabs: Tabs) {
        setTab(tabs)
    }

    return <AppContext.Provider value={{ tab, getTabComponent, setTabSelected }}>
        {children}
    </AppContext.Provider>
}

function useApp() {
    const context = useContext(AppContext)

    if (!context) throw new Error('Utilize o AuthProvider')

    return context
}

export { AppProvider, useApp }