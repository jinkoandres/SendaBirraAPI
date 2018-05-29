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
    header: <CustomHeader titleText = 'Sensors'/>,
    title: 'Sensors'
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    console.log (' constructor ' + JSON.stringify(this.props.navigation, null, 3));
    this.timeoutId = null;
    this.updateScreenIntervalId = null;

    if (params != null) {
      console.log('received value ' + params.serverIp);
      //this.setState({currentServerAddress : params.serverIp});
      this.state = {
        currentServerAddress: params.serverIp,
        currentlyConnected: 2,
        timerPeriod: params.timerPeriodInSeconds,
        lastSensorData: params.sensorData
      };
    } else {
      this.state = {
        currentServerAddress: '',
        currentlyConnected: 0,
        timerPeriod: 0,
        lastSensorData: []
      };
    }
  }

  updateSensorInfo = async () => {
    console.log('Timeout. update sensor info');
    const { lastSensorData, currentServerAddress } = this.state;
    const sensorArray = lastSensorData;

    console.log(this.state);
    try {
      let serverResponse = await fetch("http://" + currentServerAddress + "/sensors/raw");
      
      let responseText = await serverResponse.json();
      let {sensor1, sensor2, sensor3} = responseText;
      
      sensorArray[0].temp = sensor1;
      sensorArray[1].temp = sensor2;
      sensorArray[2].temp = sensor3;
      
      sensorArray.forEach((sensor) => {
        sensor.lastReading = 0;
      });

      this.setState({ lastsensorData: sensorArray });

    }catch (error) {
      alert(error.message);
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.updateSensorInfo, this.state.timerPeriod * 1000);
  }

  updateReadTime = () => {
    const { lastSensorData } = this.state;
    const sensorArray = lastSensorData;

    sensorArray.forEach(sensor => sensor.lastReading++);

    this.setState({ lastsensorData: sensorArray });
  }

  componentDidMount = () => {
    console.log('component did mount');
    this.updateScreenIntervalId = setInterval(this.updateReadTime, 1000);
    console.log('intervals are ' + this.timeoutId + ' and ' + this.updateScreenIntervalId);
    this.updateSensorInfo();
    
    this.props.navigation.addListener('willBlur', this.componentWillBlur);
  }
  componentWillBlur = () => {
    console.log('component will blur ');
    clearTimeout(this.timeoutId);
    clearInterval(this.updateScreenIntervalId);
  }
  
  renderSensors = () => {
    const { currentlyConnected, lastSensorData } = this.state
    if (currentlyConnected) {
      const currentInfo = lastSensorData.map((sensor) => {
        let fixedTemp = sensor.temp.toFixed(2);
        return <SensorView key={sensor.id} id={sensor.id} temp={fixedTemp} lastread={sensor.lastReading} />
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
          <Text style={styles.textContainer}>You are currently Not connected.</Text>
        </View>

      )
    }
  }


  render() {
    let isConnected = this.state.currentlyConnected;

    return (
      <View style={styles.homeScreenStyle}>
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
