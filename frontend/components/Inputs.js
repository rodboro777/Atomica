import React, { Component } from "react";
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { exp } from "react-native-reanimated";

class Inputs extends Component {
    state = { isFocused: false };

    onFocusChange = (v) => {
        this.setState({ isFocused: v })
    }

    render() {
        return (
            <View
                style={[styles.container, {
                    borderColor: this.state.isFocused ? 'black' : 'grey',
                    backgroundColor: this.state.isFocused ? '#cfe5ff' : '#cfe5ff'
                }]}>
                <Input
                    onBlur={() => this.onFocusChange(false)}
                    placeholder={this.props.name}
                    onFocus={() => this.onFocusChange(true)}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                    secureTextEntry={this.props.pass}
                    onChangeText={this.props.onChangeText}

                    leftIcon={
                        <Icon
                            name={this.props.icon}
                            size={22}
                            color={'black'}
                        />
                    }
                />
            </View>
        );
    };

};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 50,
        borderRadius: 3,
        marginBottom: 20,
        borderWidth: 0,
    },
    inputContainer: {
        borderBottomWidth: 0
    },
    inputText: {
        color: 'black',
        fontFamily: 'Cereal_Medium',
        marginLeft: 5
    }

});

export default Inputs;