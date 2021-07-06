import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

export default class Mainscreen extends Component {
  render() {
    return (
      <View style={{ backgroundColor:'#ff0000', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Card Screen</Text>
          <Button
          title="To Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    )
  }
}
