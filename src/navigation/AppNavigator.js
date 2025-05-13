import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import Game2048Screen from '../screens/2048game';
import PongScreen from '../screens/pong';
import Snakescreen from '../screens/snake';
import Wordlescreen from '../screens/wordle';
import WhackAMole from '../screens/moles';
import TugOfWar from '../screens/tugofwar';
import NQueens from '../screens/nqueens';



const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Bits',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="2048"
          component={Game2048Screen}
          options={{
            title: '2048',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="pong"
          component={PongScreen}
          options={{
            title: 'Pong',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="snake"
          component={Snakescreen}
          options={{
            title: 'Snake',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="wordle"
          component={Wordlescreen}
          options={{
            title: 'Wordle',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="moles" 
          component={WhackAMole}
          options={{
            title: 'moles',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
         <Stack.Screen
          name="tugofwar"
          component={TugOfWar}
          options={{
            title: 'tugofwar',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="nqueens"
          component={NQueens}
          options={{
            title: 'nqueens',
            headerStyle: {
              backgroundColor: '#4a90e2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}