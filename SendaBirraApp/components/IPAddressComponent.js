import React from 'react';
import {View, StyleSheet, Text} from 'react-native'

import { IPSegment } from '../components/IPSegment.js';

export class IPAddressComponent extends React.Component {
    componentDidMount(){
        console.log('ipaddress component did mount')
        this.makeNewAddress();
        console.log(this.makeIpString());
    }
    state = {
        segments : [
            {
                id: 0,
                value: '192'
            }, 
            {
                id: 1,
                value: '168'
            },
            {
                id: 2,
                value: '1'
            },  
            {
                id: 3,
                value: '254'
            }
        ]
    }
    
    render() {
        return (
            <View style={styles.ipContainer}>
                {this.renderSegments()}
            </View>
        )
    }

    renderSegments() {
        const { segments } = this.state;
        return segments.map(segment => <IPSegment key = {segment.id} value = {segment.value}/>);
    }
    makeNewAddress() {
        var new_address = this.makeIpString();
        this.props.onAddressChanged(new_address);
    }
    makeIpString() {
        const { segments} = this.state;
        var values = segments.map(segment => segment.value);
        return values.join('.');
    }
}

const styles = StyleSheet.create({
    ipContainer: {
        flex: 1, 
        paddingTop : 20,
        flexDirection : 'row',
        justifyContent: 'space-between',
        backgroundColor:'#bef',
        minHeight: 44,
        maxHeight : 100
      }
})