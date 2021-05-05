import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Barter from '../screens/Barter';
import RequestDetails from '../screens/RequestDetails';
import MyDonations from '../screens/MyDonations';
import Home from '../screens/Home';

export const AppStackNavigator = createStackNavigator(
  {
    Barter: {
      screen: Barter,
      navigationOptions: {
        headerShown: false,
      },
    },
    RequestDetails: {
      screen: RequestDetails,
      navigationOptions: {
        headerShown: false,
      },
    },Welcome: {
      screen: Home
    },
    MyDonations: {
      screen: MyDonations,
      navigationOptions: {
        headerShown: false,
      },
    },
    
  },
  {
    initialRouteName: 'Barter',
  }
);
