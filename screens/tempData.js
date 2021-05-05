import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { Card } from 'react-native-elements';

export default class RequestDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      requestId: null,
      requesterId: null,
      userId: null,
      itemName: null,
      description: null,
      requesterName: '',
      phoneNumber: '',
      address: '',
      requestDocumentId: '',
    };
  }

  getUserDetails = async () => {
    var email = this.props.navigation.getParam('details').userId;
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
            requesterName: data.name,
            address: data.address,
            phoneNumber: data.phoneNumber,
          });
        });
      });
  };

  addNotification = () => {
    
  }

  getUserId = async () => {
    var email = this.props.navigation.getParam('details').userId;
    await firebase
      .firestore()
      .collection('Requests')
      .where('userId', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          var docId = doc.id;
          this.setState({ requestDocumentId: docId });
        });
      });
  };

  componentDidMount() {
    this.setState({
      requestId: this.props.navigation.getParam('details').requestId,
      requesterId: this.props.navigation.getParam('details').userId,
      userId: firebase.auth().currentUser.email,
      itemName: this.props.navigation.getParam('details').itemName,
      description: this.props.navigation.getParam('details').description,
    });
    this.getUserDetails();
    this.getUserId();
  }

  updateRequestStatus = async () => {
    await this.getUserDetails();
    var requestRef = await firebase
      .firestore()
      .collection('all_donations')
      .where('requestId', '==', this.state.requestId)
      .get();
    console.log(requestRef.docs.length);
    console.log('requesterName' + this.state.requesterName);

    if (requestRef.docs.length === 0) {
      await firebase.firestore().collection('all_donations').add({
        itemName: this.state.itemName,
        requestId: this.state.requestId,
        requestedBy: this.state.requesterName,
        barterId: this.state.userId,
        requestStatus: 'barter interested',
      });
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Card containerStyle={{ marginTop: 150 }}>
          <Card.Title>Item Information</Card.Title>
          <Card>
            <Text>Name: {this.state.itemName}</Text>
            <Text>Description of the request: {this.state.description}</Text>
          </Card>
        </Card>
        <Card>
          <Card.Title>Requester Information</Card.Title>
          <Text>Requester name: {this.state.requesterName}</Text>
          <Text>Requester phoneNumber: {this.state.phoneNumber}</Text>
          <Text>Requester address: {this.state.address}</Text>
        </Card>
        <View style={{ marginHorizontal: 150 }}>
          {this.state.requesterId !== this.state.userId ? (
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => {
                this.updateRequestStatus()
                this.props.navigation.navigate('MyDonations');
              }}>
              <Text>I want to donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
