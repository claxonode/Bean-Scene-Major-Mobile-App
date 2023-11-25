import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../services/AuthContext';

/**
 * @function HomeScreen Represents the home screen
 * @returns {JSX}
 */
function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Table Selection"
          onPress={() => navigation.navigate('Tables')}
          style={styles.button}
          color={'#b27b43'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="See all orders"
          onPress={() => navigation.navigate('Orders')}
          style={styles.button}
          color={'#b27b43'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign out" onPress={signOut} style={styles.button} color={'#b27b43'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 13,
    width: '80%',
  },
  button: {
    width: '100%',
  },
});

export default HomeScreen;
