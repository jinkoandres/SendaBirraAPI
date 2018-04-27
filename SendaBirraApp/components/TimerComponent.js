import React from 'react';
import {
    View, 
    TextInput,
    StyleSheet, 
    Text
} from 'react-native';


export class TimerComponent extends React.Component {
    
    handleSubmitTimer = (event) => {
        let textValue = event.nativeEvent.text;
        this.props.setTimerCallback(parseInt(textValue));
    }

    render() {
        let stringValue = this.props.value === 0 ? '' : this.props.value.toString();
        return (
            <View style={styles.timerContainer}>
                <Text style = {styles.normalText}>Read every </Text>
                <TextInput
                    style= {styles.textView}
                    keyboardType='numeric'
                    placeholder='Enter timer period'
                    fontSize="24"
                    textAlign="center"
                    onChange={this.handleSubmitTimer}
                    onSubmitEditing = {this.handleSubmitTimer}
                    value= {stringValue}
                    returnKeyType='done'
                />
                <Text style = {styles.normalText}>seconds</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    timerContainer: {
        flex: 1,
        flexDirection : 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        maxHeight: 88
        
    },
    normalText : {
        padding : 10
    }, 
    textView: {
        flex: 1,
        backgroundColor: '#ffff',
        margin: 8,
        justifyContent: 'center',
        borderRadius: 4
    }
});