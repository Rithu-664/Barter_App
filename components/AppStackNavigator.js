import React from 'react';
import { createDrawerNavigator, Drawer } from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack'
import Barter from '../screens/Barter';
import SideBarMenu from './SideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import { useWindowDimensions } from 'react-native';
import RequestDetails from '../screens/RequestDetails';
import DrawerNavigator from './DrawerNavigator';
import MyDonations from '../screens/MyDonations'

export const AppStackNavigator = createStackNavigator(
  {
    Barter: {
      screen: Barter,
      navigationOptions:{
        headerShown:false
      }
    },
    RequestDetails: {
      screen: RequestDetails,
      navigationOptions:{
        headerShown:false
      }
    },
    MyDonations: {
      screen: MyDonations,
      navigationOptions:{
        headerShown:false
      }
    },
  },
  {
    initialRouteName: 'Barter',
  }
);
