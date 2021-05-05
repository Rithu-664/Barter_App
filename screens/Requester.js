import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  View,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import { Header } from 'react-native-elements';
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
    showFlatList: false,
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
      book_status: 'received',
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
    var userName = this.state.userName
    var requestId = this.state.requestId
    db.collection('received_items').add({
        "userName": userName,
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
          itemValue: this.state.itemValue
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
    console.log('request added');
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
      console.log("value: " + value)
    })
  }

  render() {
    if (this.state.isRequestActive === false) {
      return (
        <KeyboardAvoidingView>
          <StatusBar hidden />

          <MyHeader title="Request an item" navigation={this.props.navigation} />

          <View style={{ flex: 1, marginTop: 200 }}>
            <TextInput
              placeholder="Name of the item"
              value={this.state.itemName}
              onChangeText={(text) => {
                this.setState({ itemName: text });
              }}
              style={{
                width: '75%',
                height: 35,
                alignSelf: 'center',
                borderColor: '#8022d9',
                borderRadius: 10,
                borderWidth: 1,
                marginTop: 20,
                padding: 10,
              }}
            />

            <TextInput
              placeholder="Describe why you want the item"
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
              }}
              multiline={true}
              numberOfLines={25}
            />

          <TextInput
            style={{
              width: '75%',
              height: 35,
              alignSelf: 'center',
              borderColor: '#8022d9',
              borderRadius: 10,
              borderWidth: 1,
              marginTop: 20,
              padding: 10,
            }}
            placeholder ={"Item Value"}
            maxLength ={8}
            onChangeText={(text)=>{
              this.setState({
                itemValue: text
              })
            }}
            value={this.state.itemValue}
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
          </View>
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
