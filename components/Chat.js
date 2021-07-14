import React from 'react';
import { View, Text } from 'react-native';
//imports chat interface
import { GiftedChat } from 'react-native-gifted-chat';


export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backColor: this.props.route.params.backColor,
      name: this.props.route.params.name,
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Welcome to the chat, ${this.state.name}`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'Hi! I am the ChatBot. How are you?',
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'ChatBot',
            avatar: 'https://disruptivo.tv/wp-content/uploads/2019/10/chatbot-4071274_1920.jpg',
          },
        }
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    this.props.navigation.setOptions({ title: this.state.name }); /* displays user name in the navigation bar at the top of chat */

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }} />
    )
  }
}