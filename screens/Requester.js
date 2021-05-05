import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  View,
  StatusBar,
  StyleSheet
} from 'react-native';
import { Header } from 'react-native-elements';
import firebase from 'firebase';

export default class Requester extends React.Component {
  state = {
    itemName: '',
    description: '',
    uid: firebase.auth().currentUser.email,
  };

  onTapRequest = async (itemName, description) => {
    var uniqueId = Math.random().toString(36).substring(10);

    if (this.state.itemName === '' || this.state.description === '') {
      return Alert.alert('Error processing request', 'Enter valid info');
    } else {
      try {
        firebase.firestore().collection('Requests').add({
          userId: this.state.uid,
          uniqueId: uniqueId,
          itemName: itemName,
          description: description,
        });
      } catch (error) {
        alert(error.message);
      }
    }

    this.setState({
      itemName: '',
      description: '',
    });
    return alert('Request added');
  };

  render() {
    return (
      <KeyboardAvoidingView>
        <StatusBar hidden />
        <Header
          centerComponent={{
            text: 'Request Goods',
            style: {
              color: 'white',
              fontSize: 25,
              fontWeight: 'bold',
            },
          }}
          backgroundColor="#33CCBA"
        />

        <View style={{ alignItems: 'center', marginTop: 100 }}>
          <TextInput
            placeholder="Name of the item"
            value={this.state.itemName}
            onChangeText={(text) => {
              this.setState({ itemName: text });
            }}
            style={{
              width: '75%',
              height: 50,
              alignSelf: 'center',
              borderColor: '#8022d9',
              borderRadius: 10,
              borderWidth: 1,
              marginTop: 20,
              padding: 10,
              fontSize:20
            }}
          />

          <TextInput
            placeholder="Description"
            value={this.state.description}
            onChangeText={(text) => {
              this.setState({ description: text });
            }}
            style={{
              width: '75%',
              height: 150,
              alignSelf: 'center',
              borderColor: '#8022d9',
              borderRadius: 10,
              borderWidth: 1,
              marginTop: 20,
              padding: 10,
              fontSize:20
            }}
            multiline={true}
            numberOfLines={25}
          />

          <TouchableOpacity
            style={{
              width: 200,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderRadius: 30,
              marginTop: 30,
              alignSelf: 'center',
              backgroundColor: '#22A4B3',
            }}
            onPress={() =>
              this.onTapRequest(this.state.itemName, this.state.description)
            }>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 20 }}>
              Request
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

