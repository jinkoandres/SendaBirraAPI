import React from 'react';
import {View, StyleSheet, Text} from 'react-native'

import { IPSegment } from '../components/IPSegment.js';

export class IPAddressComponent extends React.Component {

    constructor(props) {
        super(props);
        
        init_state = { segments: [] };
        initial_array = this.props.initialIpAddress.split(".");
        
        for (var i = 0; i < initial_array.length; i++) {
            init_state.segments.push({
                id: i,
                value: initial_array[i]
            });
        }
        this.state = init_state;
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
        return segments.map(segment => <IPSegment key = {segment.id}
                                                 index = {segment.id} 
                                                 value = {segment.value} 
                                                 segmentChangeCallback = {this.onAddressSegmentChange.bind(this)}/>);
    }
    
    onAddressSegmentChange(index, new_value) {
        console.log("address changed in index " + index + " to " + new_value);
        const new_array = [...this.state.segments];
        new_array[index].value = new_value;
        this.setState({segments : new_array});
        console.log("new ip is : " + this.makeIpString());
        this.props.ipAddressChangeCallback(this.makeIpString());
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
        padding : 8,
        flexDirection : 'row',
        justifyContent: 'space-between',
        backgroundColor:'#bef',
        minHeight: 44,
        maxHeight : 100
      }
})