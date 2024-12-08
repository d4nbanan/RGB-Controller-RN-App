import React from 'react';
import { 
    StyleSheet,
    Dimensions
 } from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    textCont: {
        width: width,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0061FF"
    },
    text: {
        fontSize: 20,
        color: "#fff",
        padding: 10
    },
    buttonCont: {
        width: width,
        justifyContent: "center",
        flexDirection: "row",
    },
    button: {
        margin: 10,
        width: 150,
    },
    sliderCont: {
        alignItems: "center"
    },
    slidersCont: {
        flexDirection: "row",
        justifyContent: "center",
    },
    slider: {
        width: width * 0.9,
    },
    slider2: {
        width: width/2 * 0.9,
        margin: 5
    }
});

export {styles};