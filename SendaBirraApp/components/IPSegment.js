import React from 'react';
import { View, TextInput, StyleSheet, Keyboard} from 'react-native';

export class IPSegment extends React.Component {

    constructor(props) {
        super(props);
    }
    
    handleTextChange = (text) => {
        let valueAsInt = parseInt(text);
        console.log(valueAsInt);
        if (text === "") {
            valueAsInt = 0;
        }
        else if (Number.isNaN(valueAsInt)) {
            return;
        }
        
        this.props.segmentChangeCallback(this.props.index, valueAsInt.toString());

    }

    render() {
        return (
            <View style={styles.ipSegment}>
                <TextInput
                    maxLength={3}
                    keyboardType='numeric'
                    placeholder="255"
                    fontSize="24"
                    textAlign="center"
                    onChangeText={this.handleTextChange}
                    value={this.props.value}
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
        justifyContent: 'center',
        borderRadius: 4
    }

});