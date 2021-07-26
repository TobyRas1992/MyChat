import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
//imports chat interface
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// Firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    const firebaseConfig = {
      apiKey: "AIzaSyDYwAvERndkTQc0ctb6NW26GPZcyRA3cJA",
      authDomain: "mychat-305cc.firebaseapp.com",
      projectId: "mychat-305cc",
      storageBucket: "mychat-305cc.appspot.com",
      messagingSenderId: "598187423585",
      appId: "1:598187423585:web:ab187891035ee31dd7f720",
      measurementId: "G-55GXC552VK"
    };
    // connects to firestore database
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    };
    this.state = {
      messages: [
        {
          _id: 1,
          text: `Welcome to the chat, ${this.props.route.params.name}`,
          createdAt: new Date(),
          system: true,
        }
      ],
      user: {
        _id: '',
        name: '',
        avatar: null,
      },
      backColor: this.props.route.params.backColor,
    };
  }


  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // create a reference to the active user's documents
    this.referenceChatMessages = firebase.firestore().collection('messages');
    //authenticate the user
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // sets user state to currently active user data
      this.setState({
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
        messages: [],
      });

      //listen for collection changes for current user
      this.unsubscribeMessages = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    //stops listening for collection changes
    this.unsubscribeMessages();
    // stop listening for authentication
    this.authUnsubscribe();
  }

  //retrieves current data in 'messages' collection and stores it in state list
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || null,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || null,
        }
      });
    });
    this.setState({
      messages,
    })
  };

  //adds messages to firestore collection
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || null,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // when a user clicks send message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
      }
    );

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
    this.props.navigation.setOptions({ title: this.state.user.name });

    return (
      <View style={{ flex: 1, backgroundColor: this.state.backColor, }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderBubble={this.renderBubble.bind(this)}
          renderUsernameOnMessage={true}
          placeholder={'Type your message'}
          user={this.state.user} />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}