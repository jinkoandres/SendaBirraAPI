import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export class SensorView extends React.Component {

    render() {
        const { id, temp, lastread, warning } = this.props;
        return (
            <View style={styles.sensorContainer}>
                <View style={styles.infoContainer}>
                    <Text style= {styles.titleText}>Sensor id </Text>
                    <Text style= {warning ? styles.warning : styles.dataText}>{id}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style= {styles.titleText}>Temp</Text>
                    <Text style= {warning ? styles.warning : styles.dataText}>{temp} ºC </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style= {styles.titleText}>Last read</Text>
                    <Text style= {warning ? styles.warning : styles.dataText}>{lastread} sec</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    sensorContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems : 'center',
        backgroundColor: '#f0f0f0f0',
        marginTop: 4
    },
    infoContainer: {
        flex: 1,
        justifyContent: "space-between",
        alignItems : 'center'
    },
    warning: {
        fontSize: 32,
        color: 'red',
        fontWeight : 'bold'
    },
    titleText: {
        fontSize: 16, 
        marginBottom: 8
    },
    dataText : {
        fontSize: 30,
        fontWeight: 'bold'
    }
})
