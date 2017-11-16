import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { 
  Asset, 
  Audio,
  Constants, 
  Font } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';


export default class App extends Component {

  constructor(props){
    super(props);
    this.playbackInstance = null;
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

      const { sound, status } = Audio.Sound.create(
          require('./assets/sounds/hello.mp3'),
          { shouldPlay: true,
          volume: 1.0,
          rate: 1.0,
          }
        );

      this.playbackInstance = sound;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight>
          <View>
            <MaterialIcons
              name="play-arrow"
              size={40}
              color="#56D5FA"
            />          
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,

  },
  buttonAlert: {
    marginTop: 50,
  }
});
