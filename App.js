import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

//Componenti
// import Maps from './screens/Maps.js';
// import Posters from './screens/Posters.js';
// import Personal from './screens/Personal.js';
// import Contacts from './screens/Contacts.js';
// import Settings from './screens/Settings.js';
import BottomTabs from './navigation/BottomTabs.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [currentTab, setCurrentTab] = useState("Maps");

  return (
    <BottomTabs></BottomTabs>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#1b192d',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 30
  },
});


