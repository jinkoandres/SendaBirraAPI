import React from 'react';
import { View, TextInput, StyleSheet} from 'react-native';

export class IPSegment extends React.Component {
  render() {
    
    return (
        <View style={styles.ipSegment}>
            <TextInput
                maxLength={3}
                keyboardType='numeric'
                placeholder = "255"
                fontSize = "24" 
                textAlign = "center"
                value = {this.props.value}
            />
        </View>
    );
  }
}
const styles = StyleSheet.create({
    ipSegment: {
        flex: 1,
        padding : 2,
        backgroundColor: '#ffff',
        margin: 2,
        justifyContent : 'center'
      }

});