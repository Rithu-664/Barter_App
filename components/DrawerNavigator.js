import React from 'react';
import { createDrawerNavigator, Drawer } from 'react-navigation-drawer';
import Home from '../screens/Home';
import SideBarMenu from './SideBarMenu';
import { AppTabNavigator } from './AppTabNavigator';
import { useWindowDimensions } from 'react-native';
import SettingsScreen from '../screens/Settings';
import MyDonations from '../screens/MyDonations'
import ReceivedItems from '../screens/ReceivedItems';
import { Icon } from 'react-native-elements';
 
const DrawerNavigator = createDrawerNavigator(
  {
    Welcome: {
      screen: Home,
    },
    Home: {
      screen: AppTabNavigator,
      navigationOptions:{
        drawerIcon: <Icon name="home" type="font-awesome" />
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions:{
        drawerIcon: <Icon name="settings-sharp" type="ionicon" />
      }
    },
    MyDonations: {
      screen: MyDonations,
      navigationOptions: {
        title:'My Donations',
        drawerIcon: <Icon name="gifts" type="font-awesome-5" />
      }
    },
    ReceivedItems: {
      screen: ReceivedItems,
      navigationOptions: {
        title:'Received Items',
        drawerIcon: <Icon name="gift" type="font-awesome-5" />
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
