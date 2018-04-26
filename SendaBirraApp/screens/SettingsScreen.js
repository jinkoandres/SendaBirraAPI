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
import { IPAddressComponent} from '../components/IPAddressComponent.js'

export default class SettingsScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
    title: 'Settings',
  };

  state =  {
    connected : false,
    serverAddress: "192.168.1.254"
  }

  onServerAddressChanged = (new_address) => {
    console.log('on server address called ' + new_address);
    this.setState({serverAddress: new_address});
    console.log (this.state.serverAddress);
  }
  
  IpAddressChanged(ip) {
    console.log(ip);
    this.setState({serverAddress: ip});
  }

  async connectToServer() {
    console.log("is Already connected? " + this.state.connected);
    if (this.state.connected === false) {
      try{
      // let response = await fetch("http://" + this.state.serverAddress + "/sensors/raw");
      let response = await fetch("https://facebook.github.io/react-native/movies.json");
      let ResponseText = await response.json();
      console.log(ResponseText);
      this.setState({connected: true});
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
        <CustomHeader titleText="Settings" />
        <IPAddressComponent onAddressChanged = {this.onServerAddressChanged} 
                            initialIpAddress = {this.state.serverAddress} 
                            ipAddressChangeCallback={this.IpAddressChanged.bind(this)}/>
        
        <Button title={button_text} onPress={() => this.connectToServer()} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#bef',

  },
  contentContainer: {
    paddingTop: 10,
  },
});