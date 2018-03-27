import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export class SensorView extends React.Component {
    
    render() {
        const {id, temp, lastread, warning} = this.props;
        return (
            <View sytle={styles.sensorContainer}>
                <View style={styles.sensorId}>
                    <Text>Sensor id: {id}</Text>
                </View>
                <View style={styles.temperature}>
                    <Text >Temp: {temp} ºC</Text>
                </View>
                <View style={styles.lastReadingTime}>
                    <Text>Last reading: {lastread} seconds</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    sensorContainer:{
        flex: 1,
        borderColor:'#fa0',
        flexDirection:"column",
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
