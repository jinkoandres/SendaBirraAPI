import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

export class SensorView extends React.Component {
    
    render() {
        const {id, temp, lastread, warning} = this.props;
        return (
          <View sytle = {styles.border}>
            <Text>Sensor id: { id }</Text>
            <Text>Temp: {temp}</Text>
            <Text>Last reading: {lastread}</Text>
            
                <Text> Warning! </Text>
        
          </View>  
        );
    }

}
const styles = StyleSheet.create({
    border:{
        borderWidth:1,
        borderColor:'#fa0'
    }
})
