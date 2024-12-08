import React from 'react';
import {
    Text,
    Button,
    View,
    Dimensions,
    Image,
    TouchableOpacity,
    AppState,
    ScrollView,
    PermissionsAndroid
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Slider } from '@miblanchard/react-native-slider';
import { iosStyles } from './stylesIOS';
import { styles } from './styles';
import { Picker } from './colorPicker';
import { 
    hsv2rgb,
    componentToHex,
    rgbToHex 
} from './convert_funcs';
import unlocked from './img/l0.png';
import locked from './img/l1.png';

import { Cache } from "react-native-cache";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {NetworkInfo} from 'react-native-network-info';

// NetworkInfo.getGatewayIPAddress().then(defaultGateway => {
//     setDefaultGateway(defaultGateway);
//     console.log(defaultGateway);
// });
// NetworkInfo.getIPV4Address().then(ipv4Address => {
//     console.log(ipv4Address);
// });

const cache = new Cache({
    namespace: "myapp",
    policy: {
        maxEntries: 50000, // if unspecified, it can have unlimited entries
        stdTTL: 0 // the standard ttl as number in seconds, default: 0 (unlimited)
    },
    backend: AsyncStorage
});


// async function requestCameraPermission() {
//     try {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.ACCESS_FINE_LOCATION,
//             {
//                 'title': 'Location Permission Permission',
//                 'message': 'App needs access to your Location ' + '.'
//             }
//         )
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log("You can use the Location")
//         } else {
//             console.log("Location permission denied")
//         }
//     } catch (err) {
//         console.warn(err)
//     }
// }

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
let socket = null;

export default function App() {
    

    const [isAuthorized, setIsAuthorized] = React.useState(false);

    // NetInfo.fetch().then(state => {
    //     console.log(state.bssid);
    // });

    const [currentColor, setCurrentColor] = React.useState("#000");
    const [power, setPower] = React.useState(true);
    const [brightness, setBrightness] = React.useState(0);
    const [speedIncreasing, setSpeedIncreasing] = React.useState(true);
    const [speedFading, setSpeedFading] = React.useState(true);
    const [speedRW, setSpeedRW] = React.useState(true);
    const [lock, setLock] = React.useState(locked);
    const [stateApp, setStateApp] = React.useState("active");
    const [defaultGateway, setDefaultGateway] = React.useState("");
  
    React.useEffect(() => {
        const func = async () => {
            const ssid = await cache.get("ssid");

            if(ssid === undefined){
                // перенаправлять в tuning
            }

            if(stateApp === "active"){
                socket = new WebSocket('ws://192.168.0.145:81');
        
                socket.onopen = () => {
                    console.log("connected");
                };
                socket.onmessage = (message) => {
                    const messageObj = JSON.parse(message.data);
                
                    setCurrentColor(rgbToHex(messageObj.data.color.r, messageObj.data.color.g, messageObj.data.color.b));
                    setBrightness(messageObj.data.brightness);
                    setPower(messageObj.data.power);
                    setSpeedIncreasing(messageObj.data.speedIncreasing);
                    setSpeedFading(messageObj.data.speedFading);
                    setSpeedRW(messageObj.data.speedRW);
                };

                socket.onclose = () => {
                    console.log("disconnected")
                    func();
                };
            } else if(stateApp === "background") {
                socket.close();
            }
        }

        func();
    }, [stateApp]);
  
    AppState.addEventListener('change', (event) => {
        setStateApp(event);
    });

    return (
        <ScrollView style={styles.container}>
  
            <View style={styles.picker}>
                <View style={{position: "relative", backgroundColor: "#e7eaf0"}}>
                    <Picker
                        width={width}
                        height={height}
                        setCurrentColor={setCurrentColor}
                        socket={socket}
                        setPower={setPower}
                        power={power}
                    />
                    {lock === locked && <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(100, 100, 100, 0.3)",
                        zIndex: 0
                    }}>
        
                    </View>}
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 5
                    }}>
                        <TouchableOpacity
                            style={{
                                width: 110,
                                height: 50,
                                zIndex: 2
                            }}
                            onPress={() => {
                                if(lock === unlocked){
                                    setLock(locked);
                                } else {
                                    setLock(unlocked);
                                }
                            }}
                        >
                            <Image
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                source={lock}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View>
                    <View style={styles.textCont}>
                        <Text style={styles.text}>
                            Яркость
                        </Text>
                    </View>
                <View style={styles.sliderCont}>
                    <View  style={styles.slider}>
                        <Slider
                            value={brightness}
                            maximumValue={255}
                            minimumValue={1}
                            step={1}
                            onValueChange={(value) => {
                            setBrightness(value[0]);
                            const sendObj = {
                                "route": "/setBrightness",
                                "data": {
                                    "brightness": value[0]
                                }
                            }
                            socket.send(JSON.stringify(sendObj));
                            }}
                            animateTransitions
                            maximumTrackTintColor="#b7b7b7"
                            minimumTrackTintColor="#1073ff"
                            thumbStyle={iosStyles.thumb}
                            trackStyle={iosStyles.track}
                        />
                        </View>
                    </View>
                </View>
            </View>
            
            <View style={styles.controller}>
                
                <View style={styles.textCont}>
                    <Text style={styles.text}>
                        Радуга 1
                    </Text>
                </View>
                
                <View style={styles.sliderCont}>
                    <View style={styles.slider}>
                        <Slider
                        value={speedRW}
                        maximumValue={50}
                        minimumValue={1}
                        step={1}
                        animateTransitions
                        maximumTrackTintColor="#b7b7b7"
                        minimumTrackTintColor="#1073ff"
                        thumbStyle={iosStyles.thumb}
                        trackStyle={iosStyles.track}
                        onValueChange={(value) => {
                            setSpeedRW(value[0]);
                        }}
                        />
                    </View>
                </View>
                
                <View style={styles.buttonCont}>
                    <View style={styles.button}>
                        <Button
                        title="Запустить"
                        onPress={() => {
                            const sendObj = {
                            "route": "/setRainbowCycle",
                            "data": {
                                "activity": 1,
                                "wait": 51-speedRW
                            }
                            }
                            socket.send(JSON.stringify(sendObj));
                        }}
                        ></Button>
                    </View>
                    
                    <View style={styles.button}>
                        <Button
                        title="Остановить"
                        onPress={() => {
                            const sendObj = {
                            "route": "/setRainbowCycle",
                            "data": {
                                "activity": 0
                            }
                            }
                            socket.send(JSON.stringify(sendObj));
                        }}
                        ></Button>
                    </View>
                </View>
                
                <View style={styles.textCont}>
                    <Text style={styles.text}>
                        Затухание 1
                    </Text>
                </View>
                
                <View style={styles.slidersCont}>
                    <View style={styles.sliderCont}>
                        <View style={styles.slider2}>
                        <Text style={{textAlign: "center"}}>
                            скорость загорания
                        </Text>
                        <Slider
                            value={speedIncreasing}
                            maximumValue={50}
                            minimumValue={1}
                            step={1}
                            animateTransitions
                            maximumTrackTintColor="#b7b7b7"
                            minimumTrackTintColor="#1073ff"
                            thumbStyle={iosStyles.thumb}
                            trackStyle={iosStyles.track}
                            onValueChange={(value) => {
                            setSpeedIncreasing(value[0]);
                            }}
                        />
                        </View>
                    </View>
        
                    <View style={styles.sliderCont}>
                        <View style={styles.slider2}>
                            <Text style={{textAlign: "center"}}>
                                скорость затухания
                            </Text>
                            <Slider
                                value={speedFading}
                                maximumValue={50}
                                minimumValue={1}
                                step={1}
                                animateTransitions
                                maximumTrackTintColor="#b7b7b7"
                                minimumTrackTintColor="#1073ff"
                                thumbStyle={iosStyles.thumb}
                                trackStyle={iosStyles.track}
                                onValueChange={(value) => {
                                setSpeedFading(value[0]);
                                }}
                            />
                        </View>
                    </View>
                </View>
                
                <View style={styles.buttonCont}>
                    <View style={styles.button}>
                        <Button
                        title="Запустить"
                        onPress={() => {
                            const sendObj = {
                                "route": "/setBK",
                                "data": {
                                    "activity": 1,
                                    "waitIncreasing": speedIncreasing,
                                    "waitFading": speedFading
                                }
                            }
                            socket.send(JSON.stringify(sendObj));
                        }}
                        ></Button>
                    </View>
                    
                    <View style={styles.button}>
                        <Button
                            title="Остановить"
                            onPress={() => {
                                const sendObj = {
                                    "route": "/setBK",
                                    "data": {
                                        "activity": 0
                                    }
                                }
                                socket.send(JSON.stringify(sendObj));
                            }}
                        ></Button>
                    </View>
                </View>
    
            </View>
          
        </ScrollView>
    );
}