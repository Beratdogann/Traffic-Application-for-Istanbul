// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import TrafficResultScreen from './screens/TrafficResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'İstanbul Trafik' }}
        />
        <Stack.Screen
          name="TrafficResultScreen"
          component={TrafficResultScreen}
          options={{ title: 'Trafik Sonucu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
