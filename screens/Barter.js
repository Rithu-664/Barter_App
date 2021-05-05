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
import MyHeader from '../components/MyHeader';

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
                  .where('requestStatus','==','not received')
                  .onSnapshot((snapshot) => {
                    var docData = snapshot.docs.map((document) => document.data());
                    this.setState({
                      requests: docData,
                    });
                  });
  };

  render() {
    return (
      <View>
        <StatusBar hidden />
        
        <MyHeader navigation={this.props.navigation} title="Barter"/>
        {this.state.requests.length !== 0 ? (
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
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Avatar
                        rounded
                        icon={{ name: 'gifts', type: 'font-awesome-5' }}
                        activeOpacity={0.7}
                        source={{
                          uri:
                            'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                      <ListItem.Title>{item.itemName}</ListItem.Title>
                    </View>
                  </View>
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
        ) : (<View style={{flex:1,justifyContent:'center'}}>
          <Text>There are no requests yet</Text>
        </View>)}
      </View>
    );
  }
}
