import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export class SensorView extends React.Component {

    render() {
        const { id, temp, lastread, warning } = this.props;
        return (
            <View style={styles.sensorContainer}>
                <View style={styles.infoContainer}>
                    <Text style= {styles.titleText}>Sensor id </Text>
                    <Text style= {styles.dataText}>{id}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style= {styles.titleText}>Temp</Text>
                    <Text style= {styles.dataText}> {temp} ºC </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style= {styles.titleText}>Last read</Text>
                    <Text style= {styles.dataText}> {lastread}sec</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    sensorContainer: {
        flex: 1,
        //borderColor: '#fa0',
        flexDirection: "row",
        justifyContent: "center",
        alignItems : 'center',
        backgroundColor: '#f0f0f0f0',
        marginTop: 4
    },
    infoContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems : 'center'
    },
    warning: {
        flex: 1
    },
    titleText: {
        fontSize: 16, 
        marginBottom: 8
    },
    dataText : {
        fontSize: 24,
        fontWeight: 'bold'
    }
})
