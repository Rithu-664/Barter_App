import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { DrawerItems, Drawer } from 'react-navigation-drawer';
import Login from '../screens/Login';
import { Avatar } from 'react-native-elements';
import {FontAwesome} from '@expo/vector-icons'
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import {RFValue} from 'react-native-responsive-fontsize'

export default class SideBarMenu extends Component {
  constructor() {
    super();

    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      docId: '',
      image: '#',
    };
  }

  componentDidMount = () => {
    this.getUserProfile();
    this.fetchImage(this.state.userId);
  };

  getUserProfile = async () => {
    var email = firebase.auth().currentUser.email;
    await firebase
      .firestore()
      .collection('Users')
      .where('email_id', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          var docId = doc.id;
          this.setState({
            userName: data.name,
            docId: docId,
          });
        });
      });
  };

  uploadImage = async (uri, email) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + email);
    return ref.put(blob).then((response) => {
      this.fetchImage(email);
    });
  };

  fetchImage = async (userId) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profiles/' + userId); // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: '#' });
      });
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cancelled) {
      this.setState({ image: uri });
      this.uploadImage(uri, this.state.userId);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Constants.statusBarHeight + 15,
            marginLeft:10
          }}>
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            con={this.state.image === '#' ? {name:'user',type:'font-awesome'} : null}
            size="medium"
            onPress={() => this.selectPicture()}
          />

          <View style={{ marginLeft: 5, width: '75%' }}>
            <Text style={{ fontWeight: '200', fontSize: RFValue(25) }}>
              {'Welcome back ' + this.state.userName}
            </Text>
          </View>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>

        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('Login');
              firebase.auth().signOut();
            }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
