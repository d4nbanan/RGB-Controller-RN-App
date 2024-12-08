import React from "react";
import parse  from "node-html-parser";
import { 
    PermissionsAndroid,
    ScrollView,
    View,
    Text,
    Image,
    // AsyncStorage
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import sendReq from './sendReq';
import wifi1 from './img/wf1.png';
import wifi2 from './img/wf2.png';
import wifi3 from './img/wf3.png';
import wifi4 from './img/wf4.png';
import lock from "./img/lock.png";
import { styles } from './styles';

import { Cache } from "react-native-cache";

const cache = new Cache({
    namespace: "myapp",
    policy: {
        maxEntries: 50000, // if unspecified, it can have unlimited entries
        stdTTL: 0 // the standard ttl as number in seconds, default: 0 (unlimited)
    }
    // backend: AsyncStorage
});

// console.log(value)

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

function pickWifiDepth(percentDepth){
    const depth = Number(percentDepth.replace("%", ""));

    if(depth < 15){
        return wifi1;
    }
    if(depth < 50){
        return wifi2;
    }
    if(depth < 80){
        return wifi3;
    }

    return wifi4;
}



const Ssid = props => {
    return(
        <View style={style.ssid}>
            <Text style={style.ssidText}>
                {props.title}
            </Text>
            <View style={style.icons}>
                {props.lock && <Image
                    style={style.lock}
                    source={lock}
                />}
                <View style={style.wifi}>
                    <Image
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        source={pickWifiDepth(props.depth)}
                    />
                </View>
            </View>
        </View>
    );
}

const Tuning = props => {
    const [ssids, setSsids] = React.useState([]);
    const [DOM, setDOM] = React.useState([]);
    // const isConnected

    React.useEffect(() => {
        sendReq('http://192.168.0.103:1337/', 'GET')
            .then(data => {
                data = data.replace(/&nbsp;/g, " ");
                let dom = parse(data);
                setDOM(dom);

                // requestCameraPermission();

                let depths = dom.querySelectorAll(`.q.h`).map(item => item.innerText);
                setSsids(dom.querySelectorAll(`a[href='http://192.168.4.1/wifi?#p']`).map((ssid, i) => {
                    return({
                        name: ssid.innerText,
                        depth: depths[i],
                        lock: ssid.parentNode.childNodes[3].classList.contains("l")
                    })
                }));
                
            });
        
    }, []);

    console.log(ssids)

    return(
        <ScrollView>
            {ssids && <View style={style.container}>
                {ssids.map((ssid, i) => <Ssid lock={ssid.lock} depth={ssid.depth} title={ssid.name} key={i} />)}
            </View>}
        </ScrollView>
    );
}

const style = {
    ssidText: {
        fontSize: 16,
        maxWidth: "100%",
        width: "70%"
    },
    ssid: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        backgroundColor: "#A9CCE3",
        margin: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    icons: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        width: "30%"
    },
    wifi: {
        height: 40,
        width: 72
    },
    lock: {
        width: 20,
        height: 20
    }
}

export default Tuning;