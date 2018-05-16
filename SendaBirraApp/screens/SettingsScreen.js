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

export default class SettingsScreen extends React.Component {
  
  static navigationOptions = {
    header: <CustomHeader titleText = 'Settings'/>,
    title: 'Settings',
  };

  state =  {
    connected : false,
    serverAddress: '192.168.1.254',
    period: 10
  }

  onServerAddressChanged = (new_address) => {
    console.log('on server address called ' + new_address);
    this.setState({serverAddress: new_address});
    console.log (this.state.serverAddress);
  }
  
  IpAddressChanged(ip) {
    this.setState({serverAddress: ip});
  }

  onTimerPeriodChange = (intValue) => {
    let filteredValue = isNaN(intValue) ? 0 : intValue;
    this.setState({period: filteredValue});
    
  }
  
  async connectToServer() {
    const { navigation } = this.props;

    console.log("is Already connected? " + this.state.connected);
    if (this.state.connected === false) {
      try{
      // let response = await fetch("http://" + this.state.serverAddress + "/sensors/raw");
      let response = await fetch("https://facebook.github.io/react-native/movies.json");
      let ResponseText = await response.json();
      console.log(ResponseText);
      this.setState({connected: true});
      navigation.push('Sensors', 
      { 
        serverInfo: 
        {
          serverIp: this.state.serverAddress,
          timerPeriodInSeconds : this.state.period, 
          connectionStatus: this.state.connected,
          sensorData :
            [
              {
                id : 1, 
                temp : 37,
                lastReading : 0
              },
              {
                id : 2, 
                temp : 37,
                lastReading : 0
              },
              {
                id : 3, 
                temp : 37,
                lastReading : 0
              }
            ]
        }
      });
      } catch(error){
        this.setState({connected: false});
        alert("Can't connect to server \n Error:" + error.message);
        console.log(JSON.stringify(error));
        console.log(error);
      }
      
    }else {
      this.setState({connected: false});
    }
  }
  
  render() {
    const { mainContainer } = styles;
    let button_text = this.state.connected ? "Disconnect" : "Connect";
  
    return (
      <View style={mainContainer}>
        <Text style = {{padding: 10}}>Server IP Adress</Text>
        <IPAddressComponent onAddressChanged = {this.onServerAddressChanged} 
                            initialIpAddress = {this.state.serverAddress} 
                            ipAddressChangeCallback={this.IpAddressChanged.bind(this)}/>
        <TimerComponent value = {this.state.period} setTimerCallback = {this.onTimerPeriodChange}/>
        <Button title={button_text} onPress={() => this.connectToServer()} />

      </View>
    );
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