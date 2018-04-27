import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { CustomHeader } from '../components/CustomHeader.js';
import { SensorView } from '../components/SensorView.js';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'Sensors'
  };
  state = {
    serverInfo:
      {
        currentServerAddress: '',
        currentlyConnected: false,
        timerPeriod: 0
      },
    sensorData: []
  }
  updateSensorInfo = () => {
    console.log('Timeout. update sensor info');
    const { sensorData } = this.state;
    const sensorArray = sensorData;

    sensorArray.forEach((sensor) => {
      sensor.lastReading = 0;
    });

    this.setState({ sensorData: sensorArray });
  }

  updateReadTime = () => {
    const { sensorData } = this.state;
    const sensorArray = sensorData;

    sensorArray.forEach((sensor) => {
      sensor.lastReading++;
    });

    this.setState({ sensorData: sensorArray });
  }

  componentWillReceiveProps = (nextProps) => {
    const { params } = nextProps.navigation.state;

    if (params != null) {
      const serverInfo = params.serverInfo;
      console.log(serverInfo);
      this.setState({
        currentServerAddress: serverInfo.serverIP,
        currentlyConnected: serverInfo.connectionStatus,
        sensorData: serverInfo.sensorData
      });
      setInterval(this.updateSensorInfo, 1000 * serverInfo.timerPeriodInSeconds)
      setInterval(this.updateReadTime, 1000);
    }
  }
  renderSensors = () => {
    const { currentlyConnected, sensorData } = this.state
    if (currentlyConnected) {
      const currentInfo = sensorData.map((sensor) => {
        return <SensorView key={sensor.id} id={sensor.id} temp={sensor.temp} lastread={sensor.lastReading} />
      });
      return (
        <View style={styles.container}>
          {currentInfo}
        </View>

      );
    }
    else {
      return (
        <View style={styles.container}>
          <Text style={styles.textContainer}>You are currently Not connected. Check the Settings Tab</Text>
        </View>

      )
    }
  }


  render() {
    let isConnected = this.state.currentlyConnected;
    return (
      <View style={styles.homeScreenStyle}>
        <CustomHeader titleText="Live data" />
        {this.renderSensors()}
      </View>
    );


  }

}
const styles = StyleSheet.create({
  homeScreenStyle: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4
  },
  textContainer: {
    fontSize: 24,
    color: 'gray',
    textAlign: 'center'
  }
});
