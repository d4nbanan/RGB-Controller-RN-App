import { ColorPicker } from 'react-native-color-picker';
import { 
    hsv2rgb,
    componentToHex,
    rgbToHex 
} from './convert_funcs';

const Picker = (props) => (
    <ColorPicker
        hideSliders={true}
        onColorSelected={(color) => {
            props.setPower(!props.power);
            const sendObj = {
                "route": "/power",
                "data": {
                    "power": props.power
                }
            }
            props.socket.send(JSON.stringify(sendObj));
        }}
        onColorChange = {(color) => {
            const [r, g, b] = hsv2rgb(color["h"], color["s"], color["v"]);
            props.setCurrentColor(rgbToHex(r, g, b));
    
            const sendObj = {
            "route": "/setColorAll",
            "data": {
                "r": r,
                "g": g,
                "b": b
            }
            }
            props.socket.send(JSON.stringify(sendObj));
        }}
        style={{
            flex: 1,
            width: props.width,
            height: props.height/2,
        }}
    />
)

export {Picker};