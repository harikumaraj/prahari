import React,{Component} from 'react';
import {Text,View,ScrollView,Alert,Slider,ImageBackground,Platform,AsyncStorage} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {Hoshi} from 'react-native-textinput-effects';
import Button from "apsl-react-native-button";
import DeviceInfo from 'react-native-device-info';
import { CheckBox } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';

export default class AddNewDevice extends Component{
    static navigationOptions = {
        header:null
    };

    constructor(props){
        super(props);


        this.state={
            macId:this.props.navigation.state.params.newDeviceInfo.macId,
            deviceName:this.props.navigation.state.params.newDeviceInfo.macIdName,
            localDeviceId:DeviceInfo.getUniqueID(),
            appVersion:DeviceInfo.getVersion(),
            platform:Platform.OS,
            osVersion:DeviceInfo.getSystemVersion(),
            model:DeviceInfo.getModel(),
            diffAlert: 0,
            diffAlertPush: false,
            mindiffdaysAlert: 0,
            mindiffdaysAlertPush: false,
            maxAlert:0,
            maxAlertPush: false,
            minAlert: 0,
            minAlertPush: false,
            visible:false,
            deviceToken:"",
            deviceInfoFlag:false,
            AddAlertSettingFlag:false
        };
    }


    componentDidMount(){
        AsyncStorage.getItem("deviceToken",(err,token)=>{
            this.setState({ deviceToken:token});
        });
        if(this.props.navigation.state.params.newDeviceInfo.macId!=="" && this.props.navigation.state.params.newDeviceInfo.macIdName!=="")
        {
            this.setState({ visible:true});
            return fetch(`http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getAlertSettings/${this.props.navigation.state.params.newDeviceInfo.macId}/${DeviceInfo.getUniqueID()}`)
                .then((response) => response.json())
                .then((responseJson)=>responseJson.data[0])
                .then((myResponseJson) => {
                    this.setState({

                        diffAlert: myResponseJson.diffAlert,
                        diffAlertPush: myResponseJson.diffAlertPush,
                        mindiffdaysAlert: myResponseJson.mindiffdaysAlert,
                        mindiffdaysAlertPush: myResponseJson.mindiffdaysAlertPush,
                        maxAlert:myResponseJson.maxAlert,
                        maxAlertPush: myResponseJson.maxAlertPush,
                        minAlert: myResponseJson.minAlert,
                        minAlertPush: myResponseJson.minAlertPush,
                        visible:false
                    })
                })
                .catch(() => {
                    this.setState({ visible:false});
                    setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
                });
        }
    }

    LeftComponent(){
        return (
            <FontAwesome
                onPress={()=>this.navigateToDeviceSettingPage()}
                name="angle-left"
                size={35}
                style={{color:"#ffffff"}}
            >
            </FontAwesome>
        );
    }

    navigateToDeviceSettingPage=()=>{
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'deviceSettingPage'})
            ]
        }));
    };

    addDeviceInfo(){
        let formData=new FormData();
        formData.append("macId",this.state.macId);
        formData.append("appVersion",this.state.appVersion);
        formData.append("platform",this.state.platform);
        formData.append("osVersion",this.state.osVersion);
        formData.append("model",this.state.model);
        formData.append("deviceId",this.state.localDeviceId);
        formData.append("deviceToken",this.state.deviceToken);
        this.setState({ visible:true});
        return fetch('http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/deviceInfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:formData
        }).then((response) => response.json())
            .then((response)=>{
                if(response.statusCode===200)
                    this.setState({ visible:false,deviceInfoFlag:true});
            })
            .catch(() => {
                this.setState({ visible:false});
                setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
            });
    };

    addAlertSetting(){
        this.setState({visible:true});
        if(this.state.macId===""||this.state.deviceName==="") {
            this.setState({  visible: false});
            setTimeout(()=>{Alert.alert("Invalid attempt","Please enter device MacId and name")});
        }
        else {
            fetch('http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/addAlertSettings', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "macId": this.state.macId,
                    "macIdName": this.state.deviceName,
                    "deviceId": this.state.localDeviceId,
                    "diffAlert": this.state.diffAlert,
                    "diffAlertPush": this.state.diffAlertPush,
                    "mindiffdaysAlert": this.state.mindiffdaysAlert,
                    "mindiffdaysAlertPush": this.state.mindiffdaysAlertPush,
                    "maxAlert": this.state.maxAlert,
                    "maxAlertPush": this.state.maxAlertPush,
                    "minAlert": this.state.minAlert,
                    "minAlertPush": this.state.minAlertPush,
                    "allowPush": true
                })
            }).then((response) => response.json())
                .then(() => {
                    this.setState({  visible: false});
                    setTimeout(() => {
                        Alert.alert(
                            "Alert Update Status",
                            "Alert updated!",
                            [
                                {text: 'OK', onPress: () => this.navigateToDeviceSettingPage()}
                            ],
                            { cancelable: false }
                        )
                    });
                })
                .catch(() => {
                    this.setState({  visible: false});
                    setTimeout(() => {
                        Alert.alert("Error", "Network error! Please try again.");
                    })
                });
        }
    };


    render(){
        return(
            <ImageBackground
                source={require("../../../assets/wp3.jpg")}
                style={{flex:1,width:null,height:null}}
            >
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <View style={{flex: 1}}>
                    <Header
                        outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16",height:65}}
                        leftComponent={this.LeftComponent()}
                        centerComponent={{text: 'Add devices & Alerts', style: {color: '#ffffff', fontSize: 23}}}
                        rightComponent={null}
                    />
                </View>
                <View style={{flex:10}}>
                <ScrollView>
                    <View style={{marginLeft:"5%",marginRight:"5%"}}>
                        <Hoshi
                            label={'Enter Device MACId'}
                            value={this.state.macId}
                            labelStyle={{ color: 'white', fontSize:18, backgroundColor:"rgba(0,0,0,0)"}}
                            inputStyle={{ color: 'white', backgroundColor:"rgba(0,0,0,0)"}}
                            borderColor={'green'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(text)=>{this.setState({ macId:text})}}
                        />
                        <Hoshi
                            label={'Enter Device name'}
                            value={this.state.deviceName}
                            labelStyle={{ color: 'white', fontSize:18, backgroundColor:"rgba(0,0,0,0)"}}
                            inputStyle={{ color: 'white', backgroundColor:"rgba(0,0,0,0)"}}
                            borderColor={'green'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(text)=>{this.setState({ deviceName:text})}}
                        />
                    </View>
                    <Text style={{fontSize:19,backgroundColor:"rgba(255,255,255,0.2)",marginTop:30,color:"#ffffff",height:30,padding:2}}>  Alert 1</Text>
                    <View style={{borderBottomWidth:1,borderBottomColor:"#ffffff"}}>
                        <View style={{marginLeft:"5%",marginRight:"5%",marginTop:20}}>
                            <CheckBox
                                left
                                iconRight
                                title="If the difference between today's max and min temperature exceeds the set limit."
                                containerStyle={{backgroundColor:"rgba(255,255,255,1)",borderWidth:0,width:"100%",marginLeft:0}}
                                textStyle={{fontStyle:"normal",fontWeight:"normal",fontSize:15,color:"#000000",marginRight:5}}
                                checked={this.state.diffAlertPush}
                                onPress={()=>{this.setState({ diffAlertPush:!this.state.diffAlertPush})}}
                            />
                            <View style={{flex:1,flexDirection:"row"}}>
                                <Slider
                                    style={{flex:10,marginBottom:20,marginTop:10}}
                                    minimumValue={0}
                                    maximumValue={30}
                                    step={1}
                                    onValueChange={(value)=>{this.setState({ diffAlert:value})}}
                                />
                                <Text style={{flex:1,width:30,marginLeft:20,marginTop:17,backgroundColor:"rgba(0,0,0,0)", color:"#ffffff",fontSize:20}}>{this.state.diffAlert}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontSize:19,backgroundColor:"rgba(255,255,255,0.2)",marginTop:30,color:"#ffffff",height:30,padding:2}}>  Alert 2</Text>
                    <View style={{borderBottomWidth:1,borderBottomColor:"#ffffff"}}>
                        <View style={{marginLeft:"5%",marginRight:"5%",marginTop:20}}>
                            <CheckBox
                                left
                                iconRight
                                title="If the difference between minimum temperature of 2 consecutive nights is more than set value."
                                containerStyle={{backgroundColor:"rgba(255,255,255,1)",borderWidth:0,width:"100%",marginLeft:0}}
                                textStyle={{fontStyle:"normal",fontWeight:"normal",fontSize:15,color:"#000000",paddingRight:10}}
                                checked={this.state.mindiffdaysAlertPush}
                                onPress={()=>{this.setState({ mindiffdaysAlertPush:!this.state.mindiffdaysAlertPush})}}
                            />
                            <View style={{flex:1,flexDirection:"row"}}>
                                <Slider
                                    style={{flex:10,marginBottom:20,marginTop:10}}
                                    minimumValue={0}
                                    maximumValue={30}
                                    step={1}
                                    onValueChange={(value)=>{this.setState({ mindiffdaysAlert:value})}}
                                />
                                <Text style={{flex:1,width:30,marginLeft:20,marginTop:17,backgroundColor:"rgba(0,0,0,0)", color:"#ffffff",fontSize:20}}>{this.state.mindiffdaysAlert}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontSize:19,backgroundColor:"rgba(255,255,255,0.2)",marginTop:30,color:"#ffffff",height:30,padding:2}}>  Alert 3</Text>
                    <View style={{borderBottomWidth:1,borderBottomColor:"#ffffff"}}>
                        <View style={{marginLeft:"5%",marginRight:"5%",marginTop:20}}>
                            <CheckBox
                                left
                                iconRight
                                title="If the temperature is more than the set value"
                                containerStyle={{backgroundColor:"rgba(255,255,255,1)",borderWidth:0,width:"100%",marginLeft:0}}
                                textStyle={{fontStyle:"normal",fontWeight:"normal",fontSize:15,color:"#000000"}}
                                checked={this.state.maxAlertPush}
                                onPress={()=>{this.setState({ maxAlertPush:!this.state.maxAlertPush})}}
                            />
                            <View style={{flex:1,flexDirection:"row"}}>
                                <Slider
                                    style={{flex:10,marginBottom:20,marginTop:10}}
                                    minimumValue={0}
                                    maximumValue={60}
                                    step={1}
                                    onValueChange={(value)=>{this.setState({ maxAlert:value})}}
                                />
                                <Text style={{flex:1,width:30,marginLeft:20,marginTop:17,backgroundColor:"rgba(0,0,0,0)", color:"#ffffff",fontSize:20}}>{this.state.maxAlert}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontSize:19,backgroundColor:"rgba(255,255,255,0.2)",marginTop:30,color:"#ffffff",height:30,padding:2}}>  Alert 4</Text>
                    <View style={{borderBottomColor:"#ffffff"}}>
                        <View style={{marginLeft:"5%",marginRight:"5%",marginTop:20}}>
                            <CheckBox
                                left
                                iconRight
                                title="If the temperature is less than the set value"
                                containerStyle={{backgroundColor:"rgba(255,255,255,1)",borderWidth:0,width:"100%",marginLeft:0}}
                                textStyle={{fontStyle:"normal",fontWeight:"normal",fontSize:15,color:"#000000"}}
                                checked={this.state.minAlertPush}
                                onPress={()=>{this.setState({ minAlertPush:!this.state.minAlertPush})}}
                            />
                            <View style={{flex:1,flexDirection:"row"}}>
                                <Slider
                                    style={{flex:10,marginBottom:20,marginTop:10}}
                                    minimumValue={0}
                                    maximumValue={60}
                                    step={1}
                                    onValueChange={(value)=>{this.setState({ minAlert:value})}}
                                />
                                <Text style={{flex:1,width:30,marginLeft:20,marginTop:17,backgroundColor:"rgba(0,0,0,0)", color:"#ffffff",fontSize:20}}>{this.state.minAlert}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginLeft:"5%",marginRight:"5%",marginTop:20}}>
                        <Button
                            style={{backgroundColor:"#24a52a",borderWidth:0}}
                            onPress={()=>{
                                this.addDeviceInfo().then(()=>{this.addAlertSetting();});
                            }}
                        >
                            <Text style={{color:"#ffffff"}}>Add or update device</Text>
                        </Button>
                    </View>
                </ScrollView>
                </View>
            </ImageBackground>
        )
    }
}