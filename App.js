import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState,useContext, useCallback,useMemo  } from 'react';
import { Alert,AppRegistry } from 'react-native';
import { PaperProvider,Switch,useTheme } from 'react-native-paper';
import { name as appName } from './app.json';
import { jwtDecode } from 'jwt-decode';
import 'core-js/stable/atob';

///Screens
// import MenuList from './screens/MenuList'
import CreateScreen from './screens/CreateOrderScreen'
import TableSelection from './screens/TableSelection';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import OrdersScreen from './screens/OrdersScreen'
import EditOrderScreen from './screens/EditOrderScreen'
//Component
import DarkModeSwitch from './components/DarkModeSwitch';
//Services
import { AuthContext } from './services/AuthContext';
import {login,signOut}from './services/LoginApiService'
import {getToken,deleteToken} from './services/TokenStorage'
//Themes
import lightTheme from './theme/lightTheme.json';
import darkTheme from './theme/darkTheme.json'
import { PreferencesContext } from './services/PreferencesContext';





const Stack = createNativeStackNavigator();


export default function Main() {
  const [isThemeDark,setIsThemeDark] = useState(false)
  let theme = isThemeDark?lightTheme:darkTheme;
  const toggleTheme = useCallback(()=>{
    return setIsThemeDark(!isThemeDark)
  },[isThemeDark])

  const preferences = useMemo(
    ()=>({
      toggleTheme,
      isThemeDark,
    }),[toggleTheme,isThemeDark]
  )
  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
          <App/>
      </PaperProvider>
    </PreferencesContext.Provider>

  );
}

AppRegistry.registerComponent(appName, () => Main);


function App({ navigation }) {
  const [token,setToken] = React.useState(null)
  const theme = useTheme()


  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
        userToken = await getToken();
        const {exp} = jwtDecode(userToken);
        const expirationTime = (exp * 1000) - 60000
        //can test by changing >= to <=
        if (Date.now() >= expirationTime) {
            deleteToken();
            setToken(null)
        }
        else {
          setToken(userToken);
        }
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // setToken(userToken);
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
        try {
          if (result.authenticated){
            const {exp} = jwtDecode(result.token);
            const expirationTime = (exp * 1000) - 60000
            if (Date.now() >= expirationTime) {
            deleteToken();
            setToken(null)
            }
            setToken(result.token)
          }
          else {
            Alert.alert("Could not be authenticated");
          }
        }
        catch (error) { //Assume failed to connect to anything
          Alert.alert("Error occurred");
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
      <NavigationContainer theme={theme}>
        <Stack.Navigator  screenOptions={{
          // headerTitle:(props)=><Header></Header>,
          headerStyle:{backgroundColor:lightTheme.colors.primary},
          headerTintColor:lightTheme.colors.primaryContainer,
          statusBarColor:lightTheme.colors.primary,
          headerRight: ()=> (<DarkModeSwitch></DarkModeSwitch>)
          }}>
        {/* <Stack.Navigator  > */}
          {token == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown:false,
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: token ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <>
              {/* <Stack.Screen name="Debug" component={DebugLoginScreen}/> */}
              <Stack.Screen name="Home" component={HomeScreen}/>
              <Stack.Screen name="Tables" component={TableSelection} />

              <Stack.Screen name="Create" component={CreateScreen} options={({route})=>({title:route.params.name})} />
              {/* <Stack.Screen name='MenuList' component={MenuList} options={({route})=>({title:route.params.name})} /> */}
              {/* <Stack.Screen name='New Order' component={OrderList}/> */}
              <Stack.Screen name='Orders' component={OrdersScreen}  />
              <Stack.Screen name="UpdateOrder" component={EditOrderScreen} options={({route})=>({title:route.params.name})}  />
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