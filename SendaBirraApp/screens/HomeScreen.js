import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CustomHeader } from '../components/CustomHeader.js';
import { SensorView } from '../components/SensorView.js';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'Sensors'
  };

  render() {
    let 
    return (
      <View style={styles.homeScreenStyle}>
        <CustomHeader titleText = "Live data"/>
            <SensorView id="1" temp="30.0" lastread="20" warning="true"/>
            <SensorView id="2" temp="70.2" lastread="20" warning="false"/>
            <SensorView id="3" temp="43.5" lastread="20" warning="true"/>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  homeScreenStyle: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
