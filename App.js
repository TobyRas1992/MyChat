import React, { Component } from 'react';
/* import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native'; */
import WelcomeScreen from './components/Start';
import ChatScreen from './components/Chat';
// import gesture handler
import 'react-native-gesture-handler';
// import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}