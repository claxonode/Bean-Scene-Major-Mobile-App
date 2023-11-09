import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';

///Screens
import MenuList from './screens/MenuList'
import OrderList from './screens/CreateOrder'
import TableSelection from './screens/TableSelection';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';


//Services
import { AuthContext } from './services/AuthContext';
import {login,signOut}from './services/LoginApiService'
import {getToken,deleteToken} from './services/TokenStorage'

const Stack = createNativeStackNavigator();
export default function Main() {
  return (
    <PaperProvider>
      <App/>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);

function App({ navigation }) {
  const [token,setToken] = React.useState(null)

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
        userToken = await getToken();
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setToken(userToken);
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        const {username,password} =data;
        if (username == null || password ==null) {
          Alert.alert("Enter your credentials")
          return;
        }
        const result = await login(username,password)
        if (result.authenticated){
          setToken(result.token)
        }
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
      },
      signOut: () => {
        deleteToken();
        setToken(null); 
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        // dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {token == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: token ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <>
              {/* <Stack.Screen name="Debug" component={DebugLoginScreen}/> */}
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Tables" component={TableSelection}/>
              <Stack.Screen name='MenuList' component={MenuList} options={({route})=>({title:route.params.name})} />
              <Stack.Screen name='New Order' component={OrderList}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
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