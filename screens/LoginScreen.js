import React,{ useState } from 'react'
import { Button, View, } from 'react-native';
import { AuthContext } from '../services/AuthContext';
import { TextInput,Text, Switch,useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PreferencesContext } from '../services/PreferencesContext';
import { useContext } from 'react';


/**
 * @function LoginScreen Represents the login screen
 * @returns {JSX}
 */
export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(null);
    const [securityText,setSecurityText] = useState(true)
    const { signIn } = React.useContext(AuthContext);
    


    async function attemptLogin() {
        signIn({ username, password });
    }

    return (
        <SafeAreaView style={{flex:1,padding:20,justifyContent:'center',alignItems:'center'}}>
            <Text variant='displayMedium'>Bean Scene</Text>
            <View style={{width:'80%',alignContent:'center'}}>
                <TextInput placeholder="Staff Login" value={username} onChangeText={(text) => setUsername(text)}
                right={username&&<TextInput.Icon icon="close" onPress={()=>setUsername("")}></TextInput.Icon>} />
                <TextInput placeholder='Password' onChangeText={(text) => setPassword(text)} 
                right={<TextInput.Icon icon="eye" onPress={()=>setSecurityText(!securityText)}></TextInput.Icon>}
                secureTextEntry={securityText} />
                <Button title='Login' onPress={(e) => attemptLogin()} color={'#b27b43'}/>
            </View>
            <Text>Powered by Foie Gras</Text>
        </SafeAreaView>
    );
}

