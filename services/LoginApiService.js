import { deleteToken, getToken, storeToken } from "./TokenStorage";
import {Alert} from 'react-native';

const BASE_URL = 'http://10.0.2.2:5240';

export async function login(username, password) {
    const url = new URL('/api/Tokens', BASE_URL);

    const response = await fetch(url, {
        // method:"GET"
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password: password
        })
    })
    if (response.status === 200) {
        const token = await response.text();

        await storeToken(token);
        ///Current allows members to login because /api/Tokens/ does not check
        //if they are a staffmember or not.
        return {
            authenticated: true,
            token: token
        };
    }
    else {
        
        const modelStateErrors = await response.text();
        console.log(modelStateErrors)
        // throw new ApiError(modelStateErrors,
        //     "There was an error authen to the API"
        // );
        Alert.alert(modelStateErrors)
        return {
            authenticated: false,
            token: null
        }
    }

}

export async function signOut() {
    deleteToken();
}

export async function fetchSecuredResource() {
    const url = new URL('api/test/authorize', BASE_URL);
    const token = await getToken();

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        throw new Error('You must be authenticated to access this resource!');
    } else if (response.status === 403) {
        throw new Error('You do not have the authorization to access this resource!');
    }

    const data = await response.text();
    
    return { data: data };
}


class ApiError extends Error {
    constructor(validationErrors, ...params) {
        super(...params);

        this.validationErrors = validationErrors;
    }
}