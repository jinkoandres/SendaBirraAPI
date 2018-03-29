import React from 'react';
import { View, TextInput, StyleSheet} from 'react-native';

export class IPSegment extends React.Component {
    state = {
        currentValue: this.props.value
    }

    handleTextChange = (text) => {
        console.log('text is ' + text)
        this.setState({ currentValue: text });

  }  
  render() {
    return (
        <View style={styles.ipSegment}>
            <TextInput
                maxLength={3}
                keyboardType='numeric'
                placeholder = "255"
                fontSize = "24" 
                textAlign = "center"
                onChangeText= {this.handleTextChange}
                value = {this.state.currentValue}
            />
        </View>
    );
  }
}
const styles = StyleSheet.create({
    ipSegment: {
        flex: 1,
        backgroundColor: '#ffff',
        margin: 8,
        justifyContent : 'center',
        borderRadius : 4
      }

});