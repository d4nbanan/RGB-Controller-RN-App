import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Controller from './Controller';
import Tuning from './Tuning';

const Stack = createNativeStackNavigator();

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Главная" component={Controller} />
        {/* <Stack.Screen name="Выбор сети: выберите ваш WiFi" component={Tuning} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;