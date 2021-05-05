import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize'

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden/>
        <TouchableOpacity
          style={styles.barterButton}
          onPress={() => this.props.navigation.navigate('Barter')}>
          <Text style={styles.barterButtonText}>Barter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.requesterButton}
          onPress={() => this.props.navigation.navigate('Requester')}>
          <Text style={styles.requesterButtonText}>Requester</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  barterButton: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 25,
    borderRadius: 40,
    backgroundColor: '#8022d9',
    marginVertical: 10,
  },
  requesterButton: {
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 25,
    borderRadius: 40,
    backgroundColor: '#75F0E3',
  },
  barterButtonText: {
    fontSize: RFValue(25),
    color: 'white',
    fontWeight: '600',
  },
  requesterButtonText: {
    fontSize: RFValue(25),
    color: 'black',
    fontWeight: '600',
  },
});
