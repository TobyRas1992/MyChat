import React from 'react';
import { View, Text } from 'react-native';


export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backColor: this.props.route.params.backColor,
      name: this.props.route.params.name
    };
  }
  render() {
    this.props.navigation.setOptions({ title: this.state.name }); /* displays user name in the navigation bar at the top of chat */

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.state.backColor }}>
        <Text>Hello Screen2!</Text>
      </View>
    )
  }
}