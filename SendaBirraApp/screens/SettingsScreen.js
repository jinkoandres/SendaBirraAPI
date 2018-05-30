import React from 'react';
import {
  Image,
  TextInput,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import { CustomHeader } from '../components/CustomHeader.js';
import { IPAddressComponent } from '../components/IPAddressComponent.js';
import { TimerComponent } from '../components/TimerComponent.js';

 var connectionStatus = Object.freeze({disconnected: 0, connecting: 1, connected: 2});

export default class SettingsScreen extends React.Component {
  
  static navigationOptions = {
    header: <CustomHeader titleText = 'Settings'/>,
    title: 'Settings',
  };

  state =  {
    connected : connectionStatus.disconnected,
    serverAddress: '192.168.2.254',
    period: 10
  }

  onServerAddressChanged = (new_address) => {
    console.log('on server address called ' + new_address);
    this.setState({serverAddress: new_address});
    console.log (this.state.serverAddress);
  }
  
  onIpAddressChanged  = (ip) => {
    this.setState({serverAddress: ip});
  }

  onTimerPeriodChange = (intValue) => {
    let filteredValue = isNaN(intValue) ? 0 : intValue;
    this.setState({period: filteredValue});
    
  }
  
  connectToServer = async () => {
    const {
      navigation
    } = this.props;

    const { connected, serverAddress, period} = this.state;
    console.log(`is Already connected? ${connected}`);
    if (connected === connectionStatus.disconnected) {
      
      this.setState({
        connected: connectionStatus.connecting
      });
      
      console.log(`start fetch at http://${serverAddress}/sensors/raw`);
      let debug = false; 

      if (debug) {
        navigation.push('Sensors', this.makeObjectWithServerInfo({sensor1: 25.55, sensor2: 33.44, sensor3: 33.43}));
        return;
      }
      try {
        let response = await fetch(`http://${serverAddress}/sensors/raw`);
        // let response = await fetch("http://facebook.github.io/react-native/movies.json");
        let responseJSON = await response.json();
        console.log(`got reply ${JSON.stringify(responseJSON)}`);
        this.setState({
          connected: connectionStatus.connected
        });

        console.log('Connected. Navigating to Sensor page');
        console.log (`Parameters : ${JSON.stringify(this.makeObjectWithServerInfo(responseJSON))}`);
        navigation.push('Sensors', this.makeObjectWithServerInfo(responseJSON));
      } catch (error) {
        this.setState({
          connected: connectionStatus.disconnected
        });
        alert(`Can't connect to server \n Error: ${error.message}`);
      }

    } else {
      this.setState({
        connected: connectionStatus.disconnected
      });
    }
  }
  
  render() {
    const { mainContainer } = styles;
    
    let button_text = this.getButtonText();
    let shouldDisable = this.state.connected === connectionStatus.connecting;
    return (
      <View style={mainContainer}>
        <Text style={{ padding: 10 }}>Server IP Adress</Text>
        <IPAddressComponent onAddressChanged={this.onServerAddressChanged}
          initialIpAddress={this.state.serverAddress}
          ipAddressChangeCallback={this.onIpAddressChanged} />
        <TimerComponent value={this.state.period} setTimerCallback={this.onTimerPeriodChange} />
        <Button title={button_text} onPress={this.connectToServer} disabled={shouldDisable} />

      </View>
    );
  }
  makeObjectWithServerInfo = (responseJSON) => {
    const {serverAddress, period, connected} = this.state;
    const {sensor1, sensor2, sensor3} = responseJSON;
    
    return {
      serverIp: serverAddress,
      timerPeriodInSeconds: period,
      connectionStatus: connected,
      sensorData: [{
          id: 1,
          temp: sensor1,
          lastReading: 0
        },
        {
          id: 2,
          temp: sensor2,
          lastReading: 0
        },
        {
          id: 3,
          temp: sensor3,
          lastReading: 0
        }
      ]
    }
  }

  getButtonText = () => {
    const {connected: isConnecting} = this.state;
    
    switch (isConnecting) {
      case connectionStatus.disconnected:
      return 'Start';
      case connectionStatus.connecting:
      return 'Connecting ...';
      case connectionStatus.connected:
      return 'Disconnect';
    }
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0f0',

  },
  contentContainer: {
    paddingTop: 10,
  },
});