import React from 'react';
import { createDrawerNavigator, Drawer } from 'react-navigation-drawer';
import Home from '../screens/Home';
import SideBarMenu from './SideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import { useWindowDimensions } from 'react-native';
import SettingsScreen from '../screens/Settings';
import MyDonations from '../screens/MyDonations'
 
const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Welcome: {
      screen: Home,
    },
    Settings: {
      screen: SettingsScreen,
    },
    MyDonations: {
      screen: MyDonations,
    },
  },

  {
    contentComponent: SideBarMenu,
  },
  {
    initialRouteName: 'Welcome',
  }
);

export default DrawerNavigator
