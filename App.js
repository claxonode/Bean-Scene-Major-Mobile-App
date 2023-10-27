import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MenuList from './screens/MenuList'
import MenuList from './screens/TestMenuList'
import OrderList from './screens/CreateOrder'
import TableSelection from './screens/TableSelection';
import HomeScreen from './screens/HomeScreen';

import React, { useState } from 'react';
// import { getToken,storeToken, deleteToken} from './testing cannotcompile/TokenStorage';
// import { AuthContext } from './services/AuthContext';
// import {login} from './services/LoginApiService';

const Stack = createNativeStackNavigator();


export default function App() {
  // const [token,setToken] = useState(null)

  // React.useEffect(()=>{
  //   const tokenAsync = async() => {
  //     let userToken;
  //     try{
  //       userToken = await getToken();
  //     } catch (e) {

  //     }
  //     setToken(userToken);
  //   }
  //   tokenAsync()
  // },[])

  // const authContext = React.useMemo(()=>({
  //   signIn: async (data) => {
  //     const { username, password } = data;
 
  //     const result = await login(username, password);
  //     if (result.authenticated) {
  //       setToken(result.token);
  //     }
  //   },
  //   signOut: async () => {
  //     deleteToken();
  //     setToken(null); 
  //   },
  //   signUp: async (data) => {
  //     // In a production app, we need to send user data to server and get a token
  //     // We will also need to handle errors if sign up failed
  //     // After getting token, we need to persist the token using `SecureStore`
  //     // In the example, we'll use a dummy token

  //     // dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
  //   },
  // }),[]
  // )

  return (
    // <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} /> 
          <Stack.Screen name="Tables" component={TableSelection} />
            {/* <Stack.Screen name="Login" component={LoginScreen} /> */}

          <Stack.Screen name="Menu" component={MenuList}></Stack.Screen>
        
        <Stack.Screen name="New Order" component={OrderList}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>

    // </AuthContext.Provider>
    
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
//This is Geoff comment
//This is Zacs comment.