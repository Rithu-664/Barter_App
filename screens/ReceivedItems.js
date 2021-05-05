import React, { Component } from 'react'
import { FlatList, SafeAreaView, View } from 'react-native'
import firebase from 'firebase'
import {ListItem, Avatar} from 'react-native-elements'
import MyHeader from '../components/MyHeader'

export default class ReceivedItems extends Component {

        constructor(){
                super()

                this.state = {
                        receivedItems:[]
                }
        }

        componentDidMount(){
                firebase.firestore().collection('received_items').where('userEmail','==',firebase.auth().currentUser.email)
                .onSnapshot((snapshot) => {
                        var docData = snapshot.docs.map((document) => document.data())
                        this.setState({
                                receivedItems: docData
                        })
                })
        }

        render() {
                console.log(this.state.receivedItems)
                return (
                        <View>
                                <MyHeader title="Received Items" navigation={this.props.navigation} />
                                <FlatList
                                        data={this.state.receivedItems}
                                        renderItem={({item}) => (
                                                <ListItem>
                                                        <ListItem.Content
                                                                style={{
                                                                        backgroundColor: '#f0f0f0',
                                                                        padding: 20,
                                                                        borderRadius: 20,
                                                                }}
                                                        >
                                                                <View style={{ flexDirection: 'row' }}>
                                                                        <View>
                                                                                <Avatar
                                                                                        rounded
                                                                                        icon={{ name: 'gift', type: 'font-awesome-5' }}
                                                                                        activeOpacity={0.7}
                                                                                        source={{
                                                                                        uri:
                                                                                        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                                                                                        }}
                                                                                />
                                                                        </View>
                                                                        <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                                                                                <ListItem.Title>{item.itemName}</ListItem.Title>
                                                                                <ListItem.Subtitle right>
                                                                                        {item.requestId}
                                                                                </ListItem.Subtitle>
                                                                        </View>
                                                                </View>
                                                        </ListItem.Content>
                                                 </ListItem>
                                        )}
                                        keyExtractor={(item,index) => index.toString()}
                                />
                        </View>
                )
        }
}
