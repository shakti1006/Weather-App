import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import Home from './src/screens/Home';
import Forecast from './src/screens/Forecast';
import { store } from './src/screens/store';
import Splash from './src/screens/Splash';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="Forecast" component={Forecast} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
