import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';


// renders the "+" input area to access photos and maps
export default class CustomActions extends React.Component {

  //Function which handles the different communication features
  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.selectImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
        }
      },
    );
  };

  //Select Image from Photo Library
  selectImage = async () => {
    const { status } = await Permissions.askAsync(CAMERA_ROLL); //try "cameraRoll" if it doesn't work
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images, // only images are allowed
        }).catch((error) => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({ image: imageUrl }); // assigns the URL to message object
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Take Photo with camera
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      CAMERA,
      CAMERA_ROLL
    );
    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImageFetch(result.uri); // does this retrieve the image's URL?
          this.props.onSend({ image: imageUrl }); // assigns the URL to message object
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //Get Location
  getLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(LOCATION); // try "location" if it doesn't work
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync(
          {}
        ).catch((error) => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const altitude = JSON.stringify(result.coords.latitude);
        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //fetch image and upload to firebase storage 
  uploadImageFetch = async (uri) => {
    // 1: convert file to blob
    const blob = await new Promise((resolve, reject) => { //BLOB: Binary Large Object
      const xhr = new XMLHttpRequest(); //creates new XMLHttp request
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob"; // sets response type to 'blob'
      xhr.open("GET", uri, true); // opens connection and retrieves image
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`); // creates reference to specific image in storage

    const snapshot = await ref.put(blob); // puts blob data into reference

    blob.close(); // closes connection

    return await snapshot.ref.getDownloadURL(); // gets image URL from storage
  };


  render() {
    return (<TouchableOpacity
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Let's you choose to send an image or your geolocation."
      style={styles.container}
      onPress={this.onActionPress}>
      <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>);
  }
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

// creates an object for Context class to define the context type (function).
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};