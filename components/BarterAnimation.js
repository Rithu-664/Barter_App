import React from 'react';
import LottieView from 'lottie-react-native';

export default class SantaAnimation extends React.Component {
  render() {
    return (
      <LottieView
        source={require('../assets/39560-thanksgiving-basket.json')}
        style={{ width: '50%',alignSelf:'center' }}
        autoPlay
        loop
      />
    );
  }
}
