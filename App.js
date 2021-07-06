import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import WelcomeScreen from './components/Start';
import ChatScreen from './components/Chat';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();
export default class App extends React.Component {


  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Screen1"
        >
          <Stack.Screen
            name="Screen1"
            component={WelcomeScreen}
          />
          <Stack.Screen
            name="Screen2"
            component={ChatScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}