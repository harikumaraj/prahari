import React,{Component} from 'react';
import {View,Text,Alert,ScrollView,ImageBackground,AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Header} from 'react-native-elements';
import Button from "apsl-react-native-button";
import Spinner from 'react-native-loading-spinner-overlay';
import RadioForm, {RadioButton, RadioButtonInput} from 'react-native-simple-radio-button';


export default class DeviceSettingPage extends Component{
    static navigationOptions = {
        header:null
    };

    constructor() {
        super();
        this.state = {
            deviceInfo:[],
            reload:false,
            visible:false,
            index:""
        };
    }

    LeftComponent(){
        return (
            <MaterialIcons
                onPress={()=>this.props.screenProps.rootNavigation.navigate("DrawerOpen")}
                name="menu"
                size={35}
                style={{color:"#ffffff"}}
            >
            </MaterialIcons>
        );
    }

    RightComponent(){
        return (
            <MaterialIcons
                onPress={()=>this.props.screenProps.rootNavigation.navigate("dataPage")}
                name="home"
                size={35}
                style={{color:"#ffffff"}}
            >
            </MaterialIcons>
        );
    }

    componentDidMount(){
        this.setState({...this.state,visible:!this.state.visible});
            AsyncStorage.getItem('index').then((index) => {
                if(index!==null){
                this.setState({index: parseInt(index)})}});
        return fetch(`http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getmacIds/${DeviceInfo.getUniqueID()}`)
            .then((response) => response.json())
            .then((responseJson)=>{
                this.setState({deviceInfo:responseJson.data,visible:!this.state.visible})
            })
            .catch(() => {
                this.setState({...this.state,visible:!this.state.visible});
                setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
            });
    }

    serializeJSON = function(data) {
        return Object.keys(data).map(function (keyName) {
            return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
        }).join('&');
    };

    deleteDevice(macId){
        this.setState({...this.state,visible:!this.state.visible});
        return fetch('http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/deleteAlertSettings', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.serializeJSON({
                "macId":macId,
                "deviceId":DeviceInfo.getUniqueID(),
            })
        }).then((response) => response.json())
            .then(()=>{
                this.setState({...this.state,visible:!this.state.visible});
            })
            .catch(() => {
                this.setState({...this.state,visible:!this.state.visible});
                setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
            });
    };

    navigateToAddNewDevicePage=(buttons)=>{
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'addNewDevice',params:{newDeviceInfo: buttons}})
            ]
        }));
    };

    render(){

        return(
            <View style={{flex:1}}>
                <ImageBackground
                    style={{flex:1,width:null,height:null}}
                    source={require("../../../assets/wp3.jpg")}
                >
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                    <View style={{flex: 1}}>
                        <Header
                            outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16"}}
                            leftComponent={this.LeftComponent()}
                            centerComponent={{text: 'Add devices & Alerts', style: {color: '#ffffff', fontSize: 23}}}
                            rightComponent={this.RightComponent()}
                        />
                    </View>
                    <View style={{flex:10}}>
                        <Button
                            style={{marginTop:50,marginRight:40,marginLeft:40,marginBottom:50,backgroundColor:"rgba(0,0,0,0)",borderColor:"#ffffff"}}
                            onPress={()=>{this.props.navigation.navigate("addNewDevice",{newDeviceInfo:{macId:"",macIdName:""}})}
                            }
                        >
                            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                <Text style={{color:"#ffffff",fontWeight:"bold",flex:9,textAlign:"left",fontSize:17,marginLeft:10}}>Add new device</Text>
                                <Text style={{fontSize:30,color:"#ffffff",flex:1,textAlign:"right",marginRight:10,marginBottom:3}}> ></Text>
                            </View>
                        </Button>
                        <View style={{marginBottom:50,height:50,backgroundColor:"rgba(255,255,255,0.4)",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{
                                color:"#ffffff",
                                fontSize:20,
                            }}>
                                Select the default device
                            </Text>
                        </View>
                        <ScrollView>
                            <RadioForm
                                animation={true}
                            >
                            {
                                this.state.deviceInfo.map((buttons,index) => {
                                    return (
                                    <RadioButton key={index} >
                                        <View style={{
                                            flex: 1,
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginLeft: 40,
                                            marginRight: 40,
                                            marginTop: 5,
                                            marginBottom: 5,
                                            backgroundColor: "#5a635b",
                                            borderRadius: 10
                                        }}>
                                            <RadioButtonInput
                                                obj={buttons.macIdName}
                                                isSelected={this.state.index === index}
                                                onPress={()=>{
                                                    if(this.state.index===index){
                                                        this.setState({index:null});
                                                        AsyncStorage.setItem("index","trash");
                                                        setTimeout(() => {
                                                            this.props.screenProps.selectedDevice("trash")
                                                        }, 100);
                                                    }
                                                    else {
                                                        this.setState({index:index});
                                                        AsyncStorage.setItem("index", index.toString());
                                                        setTimeout(() => {
                                                            this.props.screenProps.selectedDevice(this.state.deviceInfo[index].macIdName)
                                                        }, 50);
                                                    }
                                                }}
                                                borderWidth={1}
                                                buttonInnerColor={"#ffffff"}
                                                buttonOuterColor={"#ffffff"}
                                                buttonStyle={{marginLeft:10}}
                                                buttonWrapStyle={{marginLeft: 10}}
                                            />
                                            <View style={{flex: 1}}>
                                            </View>
                                            <View style={{
                                                flex: 6,
                                                borderColor: "#ffffff",
                                                backgroundColor: "rgba(0,0,0,0)",
                                                borderWidth: 0,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <Text style={{
                                                    color: "#ffffff",
                                                    fontWeight: "bold",
                                                    flex: 9,
                                                    textAlign: "left",
                                                    marginLeft: 10
                                                }}>{`${buttons.macIdName}  (${buttons.macId})`}</Text>
                                                <Button
                                                    style={{
                                                        borderColor: "#ffffff",
                                                        backgroundColor: "rgba(0,0,0,0)",
                                                        borderWidth: 0,
                                                        width: 50,
                                                        paddingTop: 5
                                                    }}
                                                    onPress={() => {
                                                        this.navigateToAddNewDevicePage(buttons);
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: 30,
                                                        color: "#ffffff",
                                                        flex: 1,
                                                        textAlign: "right",
                                                        marginRight: 10,
                                                        marginBottom: 3
                                                    }}> ></Text>
                                                </Button>
                                            </View>
                                            <Button
                                                style={{
                                                    flex: 1,
                                                    backgroundColor: "rgba(0,0,0,0)",
                                                    borderColor: "#ffffff",
                                                    borderWidth: 0
                                                }}
                                                onPress={() => {
                                                    if(index===this.state.index){
                                                        Alert.alert("Warning","Please deselect the default device before deleting");
                                                    }else {
                                                        this.deleteDevice(buttons.macId).then(() => {
                                                            this.componentDidMount()
                                                        });
                                                    }
                                                }
                                                }
                                            >
                                                <Text style={{
                                                    color: "#ffffff",
                                                    fontSize: 20,
                                                    fontWeight: "bold",
                                                    marginTop: 10
                                                }}>X</Text>
                                            </Button>
                                        </View>
                                    </RadioButton>
                                    )}
                                )
                            }
                            </RadioForm>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}
