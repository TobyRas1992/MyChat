import React from 'react';
import { View, Platform, KeyboardAvoidingView, Alert } from 'react-native';
//imports chat interface
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';

//expo Permissions API and ImagePicker API
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

// location + mapview
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

import CustomActions from './CustomActions';


// Firebase
import firebase from 'firebase';
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
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    };

    let userName = this.props.route.params.name;
    this.props.navigation.setOptions({ title: userName });

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
      isConnected: false,
      image: null,
      location: null,
    };
  }

  componentDidMount() {

    // data fetch handling when online/offline
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
        console.log('user is online');
        // create a reference to the active user's firestore documents
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
              name: userName, // is this set correctly?
              avatar: "https://placeimg.com/140/140/any",
            },
            messages: [],
          });

          //listen for collection changes for current user
          this.unsubscribeMessages = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('user is offline');
        this.setState({ isConnected: false })
        this.getMessages(); //Get messages from asyncStorage
        Alert.alert('No internet connection. Unable to send messages'); //Ali: why is this not rendering?
      }
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

  // gets messages from asyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //saves messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //removes text messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // user can pick image from device library
  pickImage = async () => {
    const { status } = await Permissions.askAsync(CAMERA_ROLL);

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        this.setState({
          image: result
        });
      }
    }
  }

  //user can send photo taken with device camera 
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(CAMERA, CAMERAL_ROLL);

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        this.setState({
          image: result
        });
      }
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(LOCATION);

    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        this.setState({
          location: result,
        });
      }
    }

  }

  // when a user clicks send message in inputToolbar
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage(); //adds messages to firestore
        this.saveMessages(); // saves messages to asyncStorage
      }
    );
  }

  // styling for user renderBubble
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

  // InputToolbar not rendering when user offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props} />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />
  }

  // renders MapView if currentMessage contains data 
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    this.props.navigation.setOptions({ title: this.state.user.name });

    return (
      <View style={{ flex: 1, backgroundColor: this.state.backColor, }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderActions={this.renderCustomActions}
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomView={this.renderCustomView}
          renderUsernameOnMessage={true}
          placeholder={'Type your message'}
          user={this.state.user} />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}