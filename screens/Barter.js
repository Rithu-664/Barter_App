import React from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ListItem,Avatar } from 'react-native-elements';
import firebase from 'firebase';

export default class Barter extends React.Component {
  constructor() {
    super();

    this.state = {
      requests: [],
    };

    this.request = null;
  }

  componentDidMount =  () => {
    this.request =  firebase
                  .firestore()
                  .collection('Requests')
                  .onSnapshot((snapshot) => {
                    var docData = snapshot.docs.map((document) => document.data());
                    this.setState({
                      requests: docData,
                    });
                  });
  };

  render() {
    console.log("requests: " +this.state.requests)
    return (
      <View>
        <StatusBar hidden />
        <FlatList
          data={this.state.requests}
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

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('RequestDetails', {
                    details: item,
                  })
                }>
                <Text>Exchange</Text>
              </TouchableOpacity>
            </ListItem>
          )}
          keyExtractor={(item,index) => index.toString()}
        />
      </View>
    );
  }
}
