import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Text
} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'

export default class SideBarMenu extends React.Component {
  render(){
    return(
      <View style={{flex:1}}>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>

        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('Login');
              firebase.auth().signOut();
            }}>
            <Text style={{fontSize:25,color:'#8022d9',fontWeight:'200'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logOutButton: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 100,
    marginLeft: 20,
  },
});
