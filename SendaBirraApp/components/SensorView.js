import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export class SensorView extends React.Component {
    
    render() {
        const {id, temp, lastread, warning} = this.props;
        return (
            <View sytle={styles.sensorContainer}>
                <Text adjustFontSizeToFit = 'true'>Sensor id: {id}</Text>
                <Text adjustFontSizeToFit  = 'true'>Temp: {temp} ºC</Text>
                <Text adjustFontSizeToFit  = 'true'>Last reading: {lastread} seconds</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    sensorContainer:{
        flex: 0.5,
        borderColor:'#fa0',
        flexDirection:"row",
        justifyContent:"flex-start",
        backgroundColor: '#020202'
    },
    sensorId: {
        flex:1,
         
    },
    temperature: {
        flex: 1
    },
    lastReadingTime: {
        flex: 1
    },
    warning: {
        flex: 1
    }
})
