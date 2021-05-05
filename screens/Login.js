import React from 'react';
import {
  View,
  TextInput,
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
import { Header, Overlay } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PacmanIndicator } from 'react-native-indicators';
import { Rating, AirbnbRating, CheckBox } from 'react-native-elements';
import Constants from 'expo-constants';
import BarterAnimation from '../components/BarterAnimation';

import db from '../config';
import firebase from 'firebase';

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
                fontSize: 30,
                fontWeight: 'bold',
              }}>
              Sign up to get started
            </Text>

            <ScrollView style={{ marginTop: 20 }}>
              <TextInput
                style={styles.formTextInput}
                placeholder={'Name'}
                maxLength={20}
                onChangeText={(text) => {
                  this.setState({
                    name: text,
                  });
                }}
                keyboardAppearance="dark"
              />

              <TextInput
                style={styles.formTextInput}
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
              <TextInput
                style={styles.formTextInput}
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
              <TextInput
                style={styles.formTextInput}
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
              <TextInput
                style={styles.formTextInput}
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

              <TextInput
                style={styles.formTextInput}
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
              <TextInput
                style={styles.formTextInput}
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
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}
          backgroundColor="#33CCBA"
        />

        <BarterAnimation />

        <View>{this.showModal()}</View>

        <View style={{ justifyContent: 'center', marginTop: 100 }}>
          <TextInput
            placeholder="Email address"
            style={{
              margin: 10,
              borderWidth: 1.3,
              padding: 10,
              borderRadius: 30,
              paddingHorizontal: 15,
            }}
            keyboardType="email-address"
            keyboardAppearance="dark"
            autoCapitalize={false}
            autoFocus
            value={this.state.email}
            onChangeText={(email) => this.setState({ email: email })}
          />
          <TextInput
            placeholder="Password"
            style={{
              margin: 10,
              borderWidth: 1.3,
              padding: 10,
              borderRadius: 30,
              paddingHorizontal: 15,
            }}
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
              style={{ color: 'white', fontSize: 18 }}>
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
              style={{ color: 'white', fontSize: 18, }}>
              Sign in
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: '#8022d9',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    paddingBottom: 10,
  },
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
