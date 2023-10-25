import React from 'react';
import { View, Button } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Go to Table Selection"
        onPress={() => navigation.navigate('Tables')}
      />
    </View>
  );
}

export default HomeScreen;
