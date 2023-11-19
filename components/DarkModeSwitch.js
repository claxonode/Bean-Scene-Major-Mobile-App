import { IconButton, Switch } from "react-native-paper"
import { useContext } from "react";
import { PreferencesContext } from "../services/PreferencesContext";

export default function DarkModeSwitch() {
    const {toggleTheme,isThemeDark} = useContext(PreferencesContext)

    return (
    // <Switch color={'red'} value={isThemeDark} onValueChange={toggleTheme}></Switch>
    <IconButton icon={isThemeDark?"white-balance-sunny":"weather-night"} iconColor="white" onPress={toggleTheme}></IconButton>
    );
}