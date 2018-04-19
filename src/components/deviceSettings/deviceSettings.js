import React from 'react';
import {View,StatusBar,Platform,AsyncStorage} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {StackNavigator} from 'react-navigation';
import DeviceSettingPage from './component/deviceSettingPage';
import AddNewDevice from './component/addNewDevice';
function ShowStatusBar() {
    if (Platform.OS === 'android') {
        return (<StatusBar hidden={true}/>)
    }
    else
        return (null);
}

const SettingNavigation=StackNavigator(
    {
        deviceSettingPage:{screen:DeviceSettingPage},
        addNewDevice:{screen:AddNewDevice},
    },
);


export default class DeviceSettings extends React.Component {

    selectedDevice(device){
        if(device!==null) {
            AsyncStorage.setItem("passedDevice", device);
            console.log(device);
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('deviceToken', (err,token) => {
            if(token!==null) {
                AsyncStorage.setItem("deviceToken", token);
            }
        });
    }

    static navigationOptions={
        title:"home",
        drawerLabel:"Device Settings",
        drawerIcon:({tintColor})=>{
            return (
                <FontAwesome
                    name="cog"
                    size={25}
                    style={{color: tintColor}}
                >
                </FontAwesome>
            );
        }
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <ShowStatusBar/>
                <View style={{flex: 10}}>
            <SettingNavigation screenProps={{
                rootNavigation:this.props.navigation,selectedDevice:this.selectedDevice
            }}/>
                </View>
            </View>
        );
    }
}