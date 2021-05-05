import React from 'react';
import {
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import firebase from 'firebase';
import { ListItem } from 'react-native-elements';

export default class MyDonations extends React.Component{
  state = {
    barterId: firebase.auth().currentUser.email,
    barterName:"",
    myDonations: [],
    doc_id:''
  };

  componentDidMount = async () => {
    var barterId = this.state.barterId;
    await firebase
      .firestore()
      .collection('all_donations')
      .where('barterId', '==', barterId)
      .where("requestStatus",'==' ,'barter interested')
      .onSnapshot((snapshot) => {
        var docData = snapshot.docs.map((document) => {
          this.setState({
            doc_id:document.id
          })
          return document.data()});
        this.setState({
          myDonations: docData,
        });
      });
      this.getDonorDetails()
  };

  getDonorDetails = async () => {
    await firebase.firestore().collection("Users").where("email_id","==",this.state.barterId).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        var data = doc.data()
        this.setState({
          barterName:data.name
        })
      })
    })
  }

  addNotification = async (itemDetails, message) => {
    await firebase
      .firestore()
      .collection('all_notifications')
      .where('uniqueId', '==', itemDetails.uniqueId)
      .where('barterId', '==', itemDetails.barterId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          firebase.firestore().collection("all_notifications").doc(doc.id).update({
            date:firebase.firestore.FieldValue.serverTimestamp(),
            message:this.state.barterName + "  "+ message,
            notificationStatus:"unread"
          })
        })
      })
  };

  sendBook = async (itemDetails) => {
    if (itemDetails.requestStatus === 'Item sent') {
      
    } else {
      const message = 'sent you the item: ' + itemDetails.itemName;
      this.addNotification(itemDetails, message);
      firebase
        .firestore()
        .collection('all_donations')
        .doc(this.state.doc_id)
        .update({
          requestStatus: 'Item sent',
        });
    }
  };

  render() {
    return (
      <FlatList
          data={this.state.myDonations}
          renderItem={({ item }) => (
            <ListItem>
              <ListItem.Content
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: 20,
                  borderRadius: 20,
                }}>
                <ListItem.Title>{item.itemName}</ListItem.Title>
              </ListItem.Content>

              <TouchableOpacity onPress={() => this.sendBook(item)}>
                <Text>Send</Text>
              </TouchableOpacity>
            </ListItem>
          )}
          keyExtractor={(item,index) => index.toString()}
        />
    )
  }
}