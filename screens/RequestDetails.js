import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import { Card, Header } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import { RFValue } from 'react-native-responsive-fontsize';

export default class RequestDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      uniqueId: null,
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
      uniqueId: this.props.navigation.getParam('details').uniqueId,
      requesterId: this.props.navigation.getParam('details').userId,
      userId: firebase.auth().currentUser.email,
      itemName: this.props.navigation.getParam('details').itemName,
      description: this.props.navigation.getParam('details').description,
    });
    this.getUserDetails();
    this.getUserId();
  }

  updateBookStatus = async (name) => {
   await  this.getUserDetails()
    var requestRef= await firebase.firestore().collection("all_donations").where("uniqueId","==",this.state.uniqueId).get()
  
    if(requestRef.docs.length===0){
    await firebase.firestore().collection('all_donations').add({
      itemName: this.state.itemName,
      uniqueId: this.state.uniqueId,
      requestedBy: this.state.requesterName,
      barterId: this.state.userId,
      requestStatus: 'barter interested',
    });

    }
  };

  addNotification = async () => {
    await firebase.firestore().collection('all_notifications').add({
      itemName:this.state.itemName,
      barterId:this.state.userId,
      requesterEmail:this.state.requesterId,
      uniqueId:this.state.uniqueId,
      date:firebase.firestore.FieldValue.serverTimestamp(),
      message: 'A barter is interested to donate the item',
      notificationStatus:"unread",
    });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <Header centerComponent={{
          text: this.state.itemName,
          style: { fontSize: RFValue(30), fontWeight: '200', color: '#8022d9' },
        }}
        leftComponent={{icon:'arrow-back',onPress:() => this.props.navigation.goBack()}}
        backgroundColor="#D6DEFF"
        />
        <Card containerStyle={{marginTop:150,backgroundColor:'#F78FB3'}}>
          <Card.Title>Request Information</Card.Title>
          <Card containerStyle={{backgroundColor:'#f8a5c2'}}>
            <Text>Name: {this.state.itemName}</Text>
            <Text>description for the request: {this.state.description}</Text>
          </Card> 
        </Card>
        <Card containerStyle={{backgroundColor:'#778beb'}}>
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
                this.updateBookStatus();
                this.props.navigation.navigate('MyDonations');
                this.addNotification(this.state.requesterName);
              }}>
              <Text>I want to donate</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
