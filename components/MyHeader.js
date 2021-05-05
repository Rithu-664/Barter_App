import React from 'react';
import { Header, Icon, Badge } from 'react-native-elements';
import { View } from 'react-native';
import firebase from 'firebase';

export default class MyHeader extends React.Component {
  state = {
    value: '',
  };

  componentDidMount() {
    firebase
      .firestore()
      .collection('all_notifications')
      .where('notificationStatus', '==', 'unread')
      .where('requesterEmail', '==', firebase.auth().currentUser.email)
      .onSnapshot((snapshot) => {
        var unreadNotifications = snapshot.docs.map((doc) => doc.data());
        this.setState({
          value: unreadNotifications.length,
        });
      });
  }

  bellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          onPress={() => this.props.navigation.navigate('Notifications')}
        />
        <Badge
          value={this.state.value}
          containerStyle={{ position: 'absolute', top: -4, right: -4 }}
        />
      </View>
    );
  };

  render() {
    return (
      <Header
        centerComponent={{
          text: this.props.title,
          style: { fontSize: 30, fontWeight: '200', color: '#8022d9' },
        }}
        rightComponent={<this.bellIconWithBadge {...this.props} />}
        backgroundColor="#D6DEFF"
      />
    );
  }
}
