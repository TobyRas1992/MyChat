import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
//imports chat interface
import { GiftedChat, Bubble } from 'react-native-gifted-chat';


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
          system: true,
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

  renderBubble(props) {
    let backColor = this.state.backColor;
    if (backColor === '#090C08' || backColor === '#474056') {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#bcb8b1'
            }
          }}
          textProps={{
            style: { color: 'black' }
          }}
          timeTextStyle={{ right: { color: 'black' } }} />
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'black'
          }
        }}
      />
    )
  }

  render() {
    this.props.navigation.setOptions({ title: this.state.name }); /* displays user name in the navigation bar at the top of chat */

    return (
      <View style={{ flex: 1, backgroundColor: this.state.backColor, }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble.bind(this)}
          renderUsernameOnMessage={true}
          placeholder={'Type your message'}
          user={{
            _id: 1,
            name: this.state.name,
            avatar: '',
          }} />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}