import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {FontAwesome5} from '@expo/vector-icons'
import DrawerNavigator from './components/DrawerNavigator'
import {AppStackNavigator} from './components/AppStackNavigator'

import Login from './screens/Login'
import Barter from './screens/Barter'
import Requester from './screens/Requester'
import Home from './screens/Home'
import Notifications from './screens/Notifications';

export default function App() {
  return (
    <AppContainer/>
  );
}

const AppNavigator = createSwitchNavigator({
  Login:{screen:Login},
  Welcome:{screen: Home},
  Barter:{screen:Barter},
  Requester:{screen:Requester},
  DrawerNavigator:{screen:DrawerNavigator},
  AppStackNavigator:{screen:AppStackNavigator},
  Notifications:{screen:Notifications}
})

const AppContainer = createAppContainer(AppNavigator)
