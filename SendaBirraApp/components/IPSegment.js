import React from 'react';
import { View, TextInput, StyleSheet, Keyboard} from 'react-native';

export class IPSegment extends React.Component {
    
    handleTextChange = (text) => {
        let valueAsInt = parseInt(text);
        // if (text === "") {
        //     valueAsInt = 0;
        // }
        // else if (Number.isNaN(valueAsInt)) {
        //     return;
        // }
        // if (text.search(',') == -1)
            this.props.segmentChangeCallback(this.props.index, text);

    }

    handleSubmit = () => {
        console.log("handle submit");
        this.props.segmentSubmitCallback(this.props.index);
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
                    onSubmitEditing={this.handleSubmit}
                    value={this.props.value}
                    returnKeyType='done'
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