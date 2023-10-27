import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const storedToken = null;
const TOKEN_KEY = "JWT";

export async function storeToken(token) {
    if (Platform.OS === 'web') {
        storedToken = token;
    } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
}

export async function getToken() {
    if (Platform.OS === 'web') {
        return storedToken;
    } else {
        let result = await SecureStore.getItemAsync(TOKEN_KEY);
        return result;
    }
}

export async function deleteToken() {
    if (Platform.OS === 'web') {
        storedToken = null;
    } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
    }
}