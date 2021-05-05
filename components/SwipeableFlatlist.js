import React from 'react';
import { Text, Dimensions, View, SafeAreaView } from 'react-native';
import { ListItem, Icon, Avatar } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import { SwipeListView } from 'react-native-swipe-list-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class SwipeableFlatlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allNotifications: [{ bookName: 'xxx', message: 'in book donation' }],
      doc_id:''
    };
  }

  componentDidMount = async () => {
    await firebase
      .firestore()
      .collection('all_notifications')
      .where('requesterEmail', '==', firebase.auth().currentUser.email)
      .where('notificationStatus', '==', 'unread')
      .onSnapshot((snpshot) => {
        var docData = snpshot.docs.map((document) => {
                this.setState({
                        doc_id:document.id
                })
                return document.data()});
        this.setState({
          allNotifications: docData,
        });
      });
  };

  updateMarkAsRead = (data) => {
    firebase
      .firestore()
      .collection('all_notifications')
      .doc(this.state.doc_id)
      .update({ notificationStatus: 'read' });
  };

  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -width) {
      const newData = { ...allNotifications };
      this.updateMarkAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
    }
  };

  renderHiddenItem = () => {
    
  };

  render() {
    const renderListItem = (bookName, message) => {
      <ListItem
        leftElement={<Icon name="book" type="font-awesome" color="#dc143c" />}
        title={bookName}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        subtitle={message}
        bottomDivider
      />;
    };
    return (
      <SafeAreaView>
        <SwipeListView
          disableLeftSwipe={true}
          friction={1000}
          tension={40}
          leftOpenValue={95}
          data={this.state.allNotifications}
          renderItem={({ item }) => {
            return (
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
                        icon={{ name: 'book', type: 'font-awesome' }}
                        activeOpacity={0.7}
                        source={{
                          uri:
                            'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                      <ListItem.Title>{item.bookName}</ListItem.Title>
                      <ListItem.Subtitle right>
                        {item.message}
                      </ListItem.Subtitle>
                    </View>
                  </View>
                </ListItem.Content>
              </ListItem>
            );
          }}
          renderHiddenItem={() => <Text style={{flex:1,alignItems:"center",margin:10}}>Mark as read</Text>}
          rightOpenValue={width}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange(
            this.state.allNotifications
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }
}
