import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import SwipeableFlatlist from '../components/SwipeableFlatlist';

export default class Notifications extends React.Component {
  state = {
    notifications: [],
  };

  componentDidMount = async () => {
    await firebase
      .firestore()
      .collection('all_notifications')
      .where('requesterEmail', '==', firebase.auth().currentUser.email)
      .where('notificationStatus', '==', 'unread')
      .onSnapshot((snpshot) => {
        var docData = snpshot.docs.map((document) => document.data());
        this.setState({
          notifications: docData,
        });
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        {this.state.notifications.length > 0 ? (
          <SwipeableFlatlist notification={this.state.notifications} />
        ) : (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text>You have no notifications yet</Text>
                </View>
        )}
      </View>
    );
  }
}
