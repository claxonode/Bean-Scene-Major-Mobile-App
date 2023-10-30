import React,{ useState } from 'react'
import { Button, TextInput, View,Text } from 'react-native';
import { AuthContext } from '../services/AuthContext';



export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const { signIn } = React.useContext(AuthContext);

    async function attemptLogin() {
        signIn({ username, password });
    }

    return (
        <View >
            <Text>Login Form</Text>
            <TextInput placeholder='Username' onChangeText={(text) => setUsername(text)} />
            <TextInput placeholder='Password' onChangeText={(text) => setPassword(text)} 
             secureTextEntry />
            <Button title='Login' onPress={(e) => attemptLogin()} />
        </View>
    );
}

