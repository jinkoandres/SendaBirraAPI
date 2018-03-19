import React from 'react';
import {
  Image,
  TextInput,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CustomHeader } from '../components/CustomHeader.js';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'Settings',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    const 
    {
      mainContainer,
      ipContainer,
      ipSegment 
    } = styles;
    
    return (
      <View style={mainContainer}>
        <CustomHeader titleText="Settings" />
        <View style={ipContainer}>
          <TextInput style={ipSegment} />
          <TextInput style={ipSegment} />
          <TextInput style={ipSegment} />
          <TextInput style={ipSegment} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 10,
  },
  ipContainer: {
    flex: 1, 
    flexDirection : 'row',
    justifyContent: 'space-between',
    backgroundColor:'#ffffee'
  },
  ipSegment: {
    flex: 1,
    backgroundColor: '#ffeeff'
  }
});