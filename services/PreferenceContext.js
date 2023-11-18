import { createContext } from "react";

export const PreferenceContext = createContext({
    toggleTheme: ()=>{},
    isThemeDark: false
})