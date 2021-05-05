import React from 'react';
import { createDrawerNavigator, Drawer } from 'react-navigation-drawer';
import Home from '../screens/Home';
import SideBarMenu from './SideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import { useWindowDimensions } from 'react-native';
import SettingsScreen from '../screens/Settings';
import MyDonations from '../screens/MyDonations'
import ReceivedItems from '../screens/ReceivedItems';
 
const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Home,
    },
    Welcome: {
      screen: AppTabNavigator,
      navigationOptions:{
        title:'Donate & Request'
      }
    },
    Settings: {
      screen: SettingsScreen,
    },
    MyDonations: {
      screen: MyDonations,
      navigationOptions: {
        title:'My Donations'
      }
    },
    ReceivedItems: {
      screen: ReceivedItems,
      navigationOptions: {
        title:'Received Items'
      }
    }
  },

  {
    contentComponent: SideBarMenu,
  },
  {
    initialRouteName: 'Home',
  }
);

export default DrawerNavigator
