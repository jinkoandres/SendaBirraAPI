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

  connectToServer() {
    console.log (this.state.serverAddress);
    console.log("is Already connected? " + this.state.connected);
    if (this.state.connected === false) {
      console.log ("Start Timer on " + this.state.serverAddress);
      alert(this.state.serverAddress);
      this.setState({connected: true});
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