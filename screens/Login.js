import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Modal,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Header, Input } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PacmanIndicator } from 'react-native-indicators';
import { Rating, AirbnbRating, CheckBox } from 'react-native-elements';
import Constants from 'expo-constants';
import BarterAnimation from '../components/BarterAnimation';

import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

export default class Login extends React.Component {
  state = {
    isModalVisible: false,
    userLoggedIn: false,
    showPassword: false,
    name: '',
    age: '',
    address: '',
    confirmPassword: '',
    mobileNumber: '',
    phoneNumber: '',
    email: 'jsssjin@gmail.com',
    password: 'password',
    showPasswordSignUp: '',
    currencyCode:''
  };

  showModal = () => {
    return (
      <View>
        <Modal
          visible={this.state.isModalVisible}
          transparent={false}
          animationType="fade">
          <View style={{ marginTop: Constants.statusBarHeight }}>
            <Text
              style={{
                alignSelf: 'center',
                marginTop: 50,
                fontSize: RFValue(30),
                fontWeight: 'bold',
              }}>
              Sign up to get started
            </Text>

            <ScrollView style={{ marginTop: 20, marginHorizontal: 60 }}>
              <Input
                placeholder={'Name'}
                maxLength={20}
                onChangeText={(text) => {
                  this.setState({
                    name: text,
                  });
                }}
                keyboardAppearance="dark"
              />

              <Input
                placeholder={'Email ID'}
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={false}
                keyboardType="email-address"
              />
              <Input
                placeholder="Address"
                maxLength={20}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={false}
              />
              <Input
                placeholder="Age"
                maxLength={2}
                onChangeText={(text) => {
                  this.setState({
                    age: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={false}
              />
              <Input
                placeholder="Phone number"
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    phoneNumber: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={false}
                keyboardType="numeric"
              />
              <Input
                placeholder="Currency Code"
                maxLength={10}
                onChangeText={(text) => {
                  this.setState({
                    currencyCode: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={true}
                keyboardType="numeric"
              />

              <Input
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={false}
              />
              <Input
                placeholder={'Confirm Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
                keyboardAppearance="dark"
                autoCapitalize={false}
              />

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  this.state.password === this.state.confirmPassword
                    ? this.onSignUp(this.state.email)
                    : alert(
                        "The password and the confirm password doesn't match"
                      );
                }}>
                <Text> Register </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.setState({ isModalVisible: false })}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  };

  onSignUp = async (email) => {
    await db
      .createUserWithEmailAndPassword(email, this.state.password)
      .then(() => {
        firebase.firestore().collection('Users').add({
          name: this.state.name,
          age: this.state.age,
          phoneNumber: this.state.phoneNumber,
          address: this.state.address,
          email_id: this.state.email,
          currencyCode:this.state.currencyCode
        });

        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        alert('Uh oh! We ran into an error: ' + error);
      });
    this.setState({ email: '', password: '' });
  };

  onSignIn = async () => {
    const showToastOrAlert = async () => {
      if (Platform.OS === 'android') {
        ToastAndroid.show('User logged in!', ToastAndroid.SHORT);
      } else {
        alert('Welcome back @' + this.state.email);
      }
    };

    this.setState({ userLoggedIn: true });
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
        showToastOrAlert();
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        alert(
          "Uh oh! Couldn't sign in as we ran into an error: " + error.message
        );
      });
    this.setState({ userLoggedIn: false, email: '', password: '' });
  };

  render() {
    return (
      <View>
        <StatusBar hidden />
        <Header
          centerComponent={{
            text: 'Barter',
            style: {
              color: 'white',
              fontSize: RFValue(25),
              fontWeight: 'bold',
            },
          }}
          backgroundColor="#33CCBA"
        />

        <BarterAnimation />

        <View>{this.showModal()}</View>

        <View style={{ justifyContent: 'center', marginTop: 100 }}>
          <Input
            placeholder="Email address"
            containerStyle={{paddingHorizontal:30}}
            keyboardType="email-address"
            keyboardAppearance="dark"
            autoCapitalize={false}
            autoFocus
            value={this.state.email}
            onChangeText={(email) => this.setState({ email: email })}
          />
          <Input
            placeholder="Password"
            containerStyle={{paddingHorizontal:30}}
            value={this.state.password}
            keyboardAppearance="dark"
            onChangeText={(password) => this.setState({ password: password })}
            secureTextEntry={this.state.showPassword === false ? true : false}
          />
        </View>

        <CheckBox
          checkedColor="#0F0"
          onPress={() =>
            this.setState({
              showPassword: !this.state.showPassword,
            })
          }
          size={20}
          title="Show password"
          uncheckedColor="#F00"
          checked={this.state.showPassword}
          checkedIcon="check"
          uncheckedIcon="close"
        />

        <TouchableOpacity
          style={{
            padding: 10,
            alignItems: 'center',
            margin: 10,
            backgroundColor: '#8022d9',
            marginHorizontal: 25,
          }}
          onPress={() => this.setState({ isModalVisible: true })}>
          {this.state.createdUser === true ? (
            <PacmanIndicator size={25} color="white" />
          ) : (
            <Text
              style={{ color: 'white', fontSize: RFValue(18) }}>
              Sign up
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            alignItems: 'center',
            backgroundColor: '#EC7CC5',
            margin: 10,
            marginHorizontal: 25,
          }}
          onPress={() => this.onSignIn()}>
          {this.state.userLoggedIn === true ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              style={{ color: 'white', fontSize: RFValue(18), }}>
              Sign in
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cancelButton: {
    width: 250,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    alignSelf: 'center',
  },
  registerButton: {
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'center',
  },
});
