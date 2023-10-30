import React from 'react';
import { View, Button } from 'react-native';
import { AuthContext } from '../services/AuthContext';

function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  return (
    <View>
      <Button
        title="Go to Table Selection"
        onPress={() => navigation.navigate('Tables')}
      />
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

export default HomeScreen;
