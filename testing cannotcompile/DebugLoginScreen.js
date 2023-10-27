import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput } from 'react-native';
import { login, fetchSecuredResource, signOut } from '../services/LoginApiService';
import { Alert } from 'react-native';
import { getToken } from '../testing cannotcompile/TokenStorage';

export default function DebugLoginScreen({ navigation }) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    async function attemptLogin() {
        await login(username, password);
    }

    async function displayToken() {
        const token = await getToken();
        if (token) {
            Alert.alert(token);
        } else {
            Alert.alert('There is no stored token; the use must sign in!');
        }
    }

    async function getSecuredData() {
        try {
            const someData = await fetchSecuredResource();
        } catch (error) {
            Alert.alert(error.toString());
        }
    }

    return (
        <View style={styles.container}>
            <Text>Login Form</Text>
            <TextInput placeholder='Username' onChangeText={(text) => setUsername(text)} />
            <TextInput placeholder='Password' onChangeText={(text) => setPassword(text)} />
            <Button title='Login' onPress={(e) => attemptLogin()} />
            <Button title='Sign Out' onPress={(e) => signOut() } />
            <Button title='Display Token' onPress={(e) => displayToken()} />
            <Button title='Fetch Secured Data' onPress={(e) => getSecuredData()} />
            <Button title='Weather' onPress={(e) => navigation.navigate('Menu')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});