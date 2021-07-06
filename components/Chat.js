import React from 'react';
import { View, Text } from 'react-native';


export default class ChatScreen extends React.Component {

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name }); /* displays user name in the navigation bar at the top of chat */
    let backColor = this.route.params.backColor;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: backColor }}>
        <Text>Hello Screen2!</Text>
        {/* hi */}
      </View>
    )
  }
}