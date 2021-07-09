import React from 'react';
import { View, Text, Button, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      backColor: '#757083'
    };
  }
  render() {
    let { backColor } = this.state;
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.imgBackground}
          source={require("../assets/background-image.png")}>
          <View style={styles.main}>
            <Text style={styles.appTitle}>Let's Chat!</Text>
          </View>
          <View styles={styles.chatOptions}>
            <TextInput
              style={styles.nameInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Type your name here'
            />
            <View style={styles.box}>
              <Text style={styles.BackColorBoxText}>Choose Background Color:</Text>
              <View style={styles.backColorChoiceView}>
                <TouchableOpacity style={styles.backColor1} onPress={() => this.setState({ backColor: '#090C08' })} />
                <TouchableOpacity style={styles.backColor2} onPress={() => this.setState({ backColor: '#474056' })} />
                <TouchableOpacity style={styles.backColor3} onPress={() => this.setState({ backColor: '#8A95A5' })} />
                <TouchableOpacity style={styles.backColor4} onPress={() => this.setState({ backColor: '#B9C6AE' })} />
              </View>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: backColor, height: 60, }}
              onPress={() => this.props.navigation.navigate('Screen2', { name: this.state.name, backColor: this.state.backColor })}>
              <Text style={styles.startText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  chatOptions: {
    flex: 0.44,
    backgroundColor: '#ffffff',
    width: '88%',
    paddingLeft: '5%',
    paddingRight: '5%',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  main: {
    flex: 0.5
  },
  nameInput: {
    height: 40,
    fontSize: 16,
    fontWeight: '300',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: '3%'
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    top: 30,
    height: 50
  },
  imgBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  backColorChoiceView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    flexDirection: 'column'
  },
  BackColorBoxText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'grey',
    marginBottom: 10
  },
  backColor1: {
    backgroundColor: '#090C08',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  backColor2: {
    backgroundColor: '#474056',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  backColor3: {
    backgroundColor: '#8A95A5',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  backColor4: {
    backgroundColor: '#B9C6AE',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 60
  }
});