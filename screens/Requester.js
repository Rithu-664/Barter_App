import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Alert,
  View,
  StatusBar,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import { Header, Input } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { ListItem, Divider } from 'react-native-elements';

export default class Requester extends React.Component {
  state = {
    itemName: '',
    description: '',
    uid: firebase.auth().currentUser.email,
    isRequestActive: '',
    uniqueId: '',
    requestedItemName: '',
    requestStatus: '',
    docId: '',
    data: null,
    userDocId:'',
    requestId:'',
    currencyCode:'',
    itemValue:''
  };

  async componentDidMount() {
    this.getIsRequestActive();
    this.getRequest();
    this.getData()
  }

  getIsRequestActive = async () => {
    await firebase
      .firestore()
      .collection('Users')
      .where('email_id', '==', this.state.uid)
      .onSnapshot((snap) => {
        snap.forEach((doc) => {
          var status = doc.data();
          var docId = doc.id
          this.setState({ isRequestActive: status.isRequestActive, userDocId: docId });
        });
      });
  };

  getRequest = () => {
    firebase
      .firestore()
      .collection('Requests')
      .where('userId', '==', this.state.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().requestStatus !== 'received') {
            this.setState({
              uniqueId: doc.data().uniqueId,
              requestedItemName: doc.data().itemName,
              requestStatus: doc.data().requestStatus,
              docId: doc.id,
            });
          }
        });
      });
  };

  updateBookRequestStatus = () => {
    //updating the book status after receiving the book
    firebase.firestore().collection('Requests').doc(this.state.docId).update({
      requestStatus: 'received',
    });

    //getting the  doc id to update the users doc
    firebase
      .firestore()
      .collection('Users')
      .where('email_id', '==', this.state.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          firebase.firestore().collection('Users').doc(doc.id).update({
            isRequestActive: false,
          });
        });
      });
  };

  receivedItems=(itemName)=>{
    var userEmail = this.state.uid
    var requestId = this.state.requestId
    firebase.firestore().collection('received_items').add({
        "userEmail": userEmail,
        "itemName":itemName,
        "requestId"  : requestId,
    })
  }

  sendNotification = () => {
    //to get the first name and last name
    firebase
      .firestore()
      .collection('Users')
      .where('email_id', '==', this.state.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().name;

          firebase
            .firestore()
            .collection('all_notifications')
            .where('uniqueId', '==', this.state.uniqueId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var barterId = doc.data().barterId;
                var itemName = doc.data().itemName;

                //targert user id is the donor id to send notification to the user
                firebase
                  .firestore()
                  .collection('all_notifications')
                  .add({
                    targeted_user_id: barterId,
                    message: name + ' ' + ' received the item ' + itemName,
                    notification_status: 'unread',
                    itemName: itemName,
                  });
              });
            });
        });
      });
  };

  onTapRequest = async (itemName, description) => {
    var uniqueId = Math.random().toString(36).substring(10);
    this.setState({
      requestId: uniqueId
    })

    if (this.state.itemName === '' || this.state.description === '') {
      return Alert.alert('Error processing request', 'Enter valid info');
    } else {
      try {
        firebase.firestore().collection('Requests').add({
          userId: this.state.uid,
          uniqueId: uniqueId,
          itemName: itemName,
          description: description,
          itemValue: this.state.itemValue,
          requestStatus:'not received'
        });
        firebase.firestore().collection('Users').doc(this.state.userDocId).update({
          isRequestActive:true
        })
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

  getData(){
    fetch('http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1')
    .then(res => {
      return res.json()
    }).then(resData => {
      var currencyCode = this.state.currencyCode
      var currency = resData.rates.INR
      var value = 69 / currency
    })
  }

  render() {
    if (this.state.isRequestActive === false) {
      return (
        <KeyboardAvoidingView>
          <StatusBar hidden />

          <MyHeader title="Request an item" navigation={this.props.navigation} />

          <ScrollView style={{marginTop:200,marginHorizontal:30}}>
            <Input
              placeholder="Name of the item"
              value={this.state.itemName}
              onChangeText={(text) => {
                this.setState({itemName: text})
              }}
            />
            <Input
              placeholder="Description"
              value={this.state.description}
              onChangeText={(text) => {
                this.setState({description: text})
              }}
              multiline={true}
              numberOfLines={25}
            />
            <Input
              placeholder="Item value"
              value={this.state.itemValue}
              onChangeText={(text) => {
                this.setState({itemValue: text})
              }}
              maxLength={8}
            />

            <TouchableOpacity
              style={{
                width: 200,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 30,
                alignSelf: 'center',
              }}
              onPress={() =>
                this.onTapRequest(this.state.itemName, this.state.description)
              }>
              <Text>Request</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View
            style={{
              borderColor: 'orange',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}>
            <Text> Request Status </Text>

            <Text>{this.state.requestStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'orange',
              backgroundColor: 'orange',
              width: 300,
              alignSelf: 'center',
              alignItems: 'center',
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedItems(this.state.requestedItemName);
            }}>
            <Text>I recieved the item </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
