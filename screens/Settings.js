import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Header } from 'react-native-elements';
import { Component } from 'react';
import firebase from 'firebase';
import db from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MyHeader from '../components/MyHeader';
export default class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      phoneNumber: '',
      name: '',
      address: '',
      docId: '',
    };
  }
  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    firebase
      .firestore()
      .collection('Users')
      .where('email_id', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          var docId = doc.id;
          this.setState({
            name: data.name,
            address: data.address,
            phoneNumber: data.phoneNumber,
            docId: docId,
          });
        });
      });
  };
  componentDidMount() { 
    this.getUserDetails();
  }
  updateUserDetails = async () => {
    await firebase
      .firestore()
      .collection('Users')
      .doc(this.state.docId)
      .update({
        name: this.state.name,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
      })
      .then(() => {
        Alert.alert('Profile updated', 'Your profile has been updated', [
          {
            text: 'OK',
            style: 'cancel',
          },
        ]);
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        
        <MyHeader navigation={this.props.navigation} title="Settings"/>
        <TextInput
          style={style.input}
          placeholder="Username"
          value={this.state.name}
          keyboardAppearance="dark"
          onChangeText={(text) => {
            this.setState({ name: text });
          }}
        />
        <TextInput
          style={style.input}
          placeholder="Address"
          multiline={true}
          numberOfLines={5}
          keyboardAppearance="dark"
          value={this.state.address}
          onChangeText={(text) => {
            this.setState({ address: text });
          }}
        />
        <TextInput
          style={style.input}
          placeholder="Phone number"
          value={this.state.phoneNumber}
          keyboardType="numeric"
          keyboardAppearance="dark"
          maxLength={10}
          onChangeText={(text) => {
            this.setState({ phoneNumber: text });
          }}
        />

        <TouchableOpacity
          style={{
            padding: 10,
            alignItems: 'center',
            backgroundColor: '#EC7CC5',
            margin: 10,
            marginHorizontal: 25,
          }}
          onPress={() => this.updateUserDetails()}>
          <Text
            style={{ color: 'white', fontSize: 18 }}>
            {' '}
            Update
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const style = StyleSheet.create({
  input: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#8022d9',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 50,
    padding: 10,
  },
});
