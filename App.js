import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  Button,
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
    this.state = {
      shouldPlay: false,
      isPlaying: false,
      repeat: 0,
      remain: 0,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
    };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
      
    this._loadNewPlaybackInstance(false);            

  }
    

  async _loadNewPlaybackInstance(playing) {

      if (this.playbackInstance != null) {
        await this.playbackInstance.unloadAsync();
        this.playbackInstance.setOnPlaybackStatusUpdate(null);
        this.playbackInstance = null;
      }

      const source = require('./assets/sounds/hello.mp3'); 
      const initialStatus = { shouldPlay: this.state.shouldPlay,
          volume: 1.0,
          rate: 1.0,          
          };

      const { sound, status } = await Audio.Sound.create(
          source,
          initialStatus,
          this._onPlaybackStatusUpdate
        );

      this.playbackInstance = sound;
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
      });
      if ((status.positionMillis == status.durationMillis) && (this.state.repeat != 0)) {
        this._Loop(true);
      }
    }
  };

  _Loop = (LoopTrue) => {
    if (this.state.repeat != 0) {
      this.setState({
        playbackInstancePosition: 0,
        remain: this.state.remain-1,
        shouldPlay: true,
      });
    }
    if (this.state.remain == 0) {
      this.setState({
        repeat: 0,
      });
    }
      this._loadNewPlaybackInstance(false);
  }
  

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onPressLearnMore = () => {
    this.setState({
      repeat: this.state.repeat+1,
      remain: this.state.remain+1,
    });

  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(
        this.state.playbackInstanceDuration
      )}`;
    }
    return '';
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableHighlight
            onPress={this._onPlayPausePressed}
          >
          <View>
            {this.state.isPlaying ? (
              <MaterialIcons
                name="pause"
                size={40}
                color="#56D5FA"
              />
            ) : (
              <MaterialIcons
                name="play-arrow"
                size={40}
                color="#56D5FA"
              />
            )}
          </View>
          </TouchableHighlight>
        </View>
        <View>
          <Button
            onPress={this._onPressLearnMore}            
            title="Repeat Same Song"
            color="#841584"
          />
          <Text>{this.state.repeat} Repeat</Text>
          <Text>{this.state.remain} Remain</Text>
          <Text>{this.state.playbackInstancePosition} Milli seconds</Text>
          <Text>{this.state.playbackInstanceDuration} Total milli seconds</Text>
        </View>
        <View>
          <Text>
            {this._getTimestamp()} Time
          </Text>
        </View>
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
