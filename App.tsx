/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { SampleScreen } from './src/screens/SampleScreen';
import { QuickCryptoTestScreen } from './src/screens/QuickCryptoTestScreen';
import { AesCryptoTestScreen } from './src/screens/AesCryptoTestScreen';
import { ApiTestScreen } from './src/screens/ApiTestScreen';
import { NobleCurvesTestScreen } from './src/screens/NobleCurvesTestScreen';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SampleScreen" component={SampleScreen} />
        <Stack.Screen name="QuickCryptoTest" component={QuickCryptoTestScreen} />
        <Stack.Screen name="AesCryptoTest" component={AesCryptoTestScreen} />
        <Stack.Screen name="ApiTest" component={ApiTestScreen} />
        <Stack.Screen name="NobleCurvesTest" component={NobleCurvesTestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
