import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Barter from '../screens/Barter';
import Requester from '../screens/Requester';
import {FontAwesome5} from '@expo/vector-icons'

export const AppTabNavigator = createBottomTabNavigator({
  Barter : {
    screen: Barter,
    navigationOptions :{
      tabBarIcon : <FontAwesome5 name="donate" size={24} color="black" />,
      tabBarLabel : "Donate Goods",
    }
  },
  Requester: {
    screen: Requester,
    navigationOptions :{
      tabBarIcon : <FontAwesome5 name="shopping-basket" size={24} color="black" />,
      tabBarLabel : "Request Goods",
    }
  }
});