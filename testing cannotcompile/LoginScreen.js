import { useState } from 'react'
import { Button, TextInput, View,Text } from 'react-native';
import { AuthContext } from '../services/AuthContext';
import { login } from '../services/LoginApiService';

export default function LoginScreen() {
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);

    async function attemptLogin() {
        signIn({usename,password})
    }

    return (
        <View>
            <Text>Login Form</Text>
            <TextInput placeholder="Username" onChangeText={(text) => setUsername(text)} ></TextInput>
            <TextInput placeholder="Password" onChangeText={(text) => setUsername(text)} ></TextInput>
            <Button title="Login" onPress={(e)=>attemptLogin()}></Button>
        </View>
    );
}
