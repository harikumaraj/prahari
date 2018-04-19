import React from 'react';
import {Text,View,TouchableOpacity,Alert,ScrollView,ImageBackground,AsyncStorage} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';
import TempGraph from './tempGraph';
import HumidityGraph from './humidityGraph';
import DeviceInfo from 'react-native-device-info';
import Button from 'apsl-react-native-button';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import PushNotification from 'react-native-push-notification'

const days=[
    {"value":"1"},
    {"value":"7"},
    {"value":"30"},
];



export default class DisplayGraph extends React.Component {

    static navigationOptions={
        drawerLabel:"Home",
        drawerIcon:({tintColor})=>{
            return (
                <FontAwesome
                    name="area-chart"
                    size={25}
                    style={{color: tintColor}}
                >
                </FontAwesome>
            );
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            tempOrHumid:3,
            selectedDays:"",
            isDateTimePickerVisible: false,
            macDevices:[],
            selectedDevice:"",
            selectedDate:"Date",
            revisedDate:"",
            tempData:[],
            humidData:[],
            humidMax:[],
            humidMin:[],
            tempMax:[],
            tempMin:[],
            dateOrTime:[],
            graphDate:[],
            visible:false,
            emptyData:false,
            tempButtonColor:"#24a52a",
            humidButtonColor:"#24a52a",
            deviceToken:""
        };
    }

    LeftComponent(){
        return (
            <MaterialIcons
                onPress={()=>(this.props.navigation.navigate("DrawerOpen"))}
                name="menu"
                size={35}
                style={{color:"#ffffff"}}
            >
            </MaterialIcons>
        );
    }

    RightComponent(){
        return (
            <View style={{flexDirection:"row"}}>
                <FontAwesome
                    onPress={() => (this.props.navigation.navigate("alerts"))}
                    name="bell"
                    size={25}
                    style={{color: "#ffffff",marginRight:10,marginTop:5}}
                >
                </FontAwesome>
                <MaterialIcons
                    onPress={()=>{this.getTempHumidData();}}
                    name="refresh"
                    size={35}
                    style={{color:"#ffffff"}}
                >
                </MaterialIcons>
            </View>
        );
    }

    componentDidMount(){

        this.getMacIds();

        let setStateForPassedDevice=((passedDevice)=>{
            if(passedDevice!=="trash" && passedDevice!==null) {
                this.setState({selectedDevice: passedDevice});
                this.setState({selectedDays:"1"});
                this._handleDatePicked(new Date());
                setTimeout(()=> {
                    this.getTempHumidData().then(() => {
                        this.setState({tempOrHumid: 0, tempButtonColor: "#215424", humidButtonColor: "#24a52a"})
                    })
                })
            }
        }).bind(this);

        AsyncStorage.getItem('passedDevice', (err,passedDevice) => {
            setStateForPassedDevice(passedDevice);
        });

        let changeStateAndStoreInAsyncStorage=((token)=>{
            this.setState({deviceToken:token.token});
            AsyncStorage.setItem("token",token.token);
        }).bind(this);


        let navigate=(()=>{
            this.props.navigation.navigate("alerts");
        }).bind(this);


        PushNotification.configure({

            onRegister: function(token) {
                changeStateAndStoreInAsyncStorage(token);
            },
            onNotification: function(notification) {
                if(notification.foreground===false){
                    navigate();
                }
                else {
                    Alert.alert(
                        notification.alert,
                        notification.message,
                        [
                            {text: 'Alert page', onPress: () => navigate()},
                            {text: 'OK', onPress: () => {}},
                        ],
                        {cancelable: false}
                    )
                }
            },

            popInitialNotification: true,
            requestPermissions: true,
        });
    }

    getMacIds(){
        this.setState({visible:!this.state.visible});
        fetch(`http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getmacIds/${DeviceInfo.getUniqueID()}`)
            .then((response) =>response.json())
            .then((intermediateResponseJson)=>intermediateResponseJson.data)
            .then((responseJson)=> {
                let newMacDevices=[];
                for(let temp in responseJson){
                    newMacDevices.push({"value": responseJson[temp].macIdName,"macId":responseJson[temp].macId});
                }

                this.setState({macDevices: newMacDevices,visible:!this.state.visible});
            })
            .catch(() => {
                this.setState({...this.state,visible:!this.state.visible});
                setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
            });
    }


    _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

    _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

    _handleDatePicked = (date) => {
        let newDate=date.toString().substr(4,11);
        let day=newDate.substr(4,2);
        let month=newDate.substr(0,3);
        let year=newDate.substr(7,4);
        switch(month){
            case "Jan":month="01";break;
            case "Feb":month="02";break;
            case "Mar":month="03";break;
            case "Apr":month="04";break;
            case "May":month="05";break;
            case "Jun":month="06";break;
            case "Jul":month="07";break;
            case "Aug":month="08";break;
            case "Sep":month="09";break;
            case "Oct":month="10";break;
            case "Nov":month="11";break;
            case "Dec":month="12";break;
        }
        let revisedDate=year.concat("-",month,"-",day);
        this.setState({selectedDate:newDate,revisedDate:revisedDate,tempOrHumid:3,tempButtonColor:"#24a52a",humidButtonColor:"#24a52a"});
        this._hideDateTimePicker();
    };

    tempOrHumid() {
        if (this.state.tempOrHumid===0 && this.state.emptyData===false) {
            return <TempGraph
                data={this.state.tempData}
                tempMax={this.state.tempMax}
                tempMin={this.state.tempMin}
                tempDateOrTime={this.state.dateOrTime}
                graphDate={this.state.graphDate}
                days={this.state.selectedDays}
                date={this.state.selectedDate}
            />
        }
        else if(this.state.tempOrHumid===1 && this.state.emptyData===false)
        {
            return <HumidityGraph
                data={this.state.humidData}
                humidMax={this.state.humidMax}
                humidMin={this.state.humidMin}
                humidDateOrTime={this.state.dateOrTime}
                graphDate={this.state.graphDate}
                days={this.state.selectedDays}
                date={this.state.selectedDate}
            />
        }
        else{
            return <View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0)"}}>
                <Text style={{fontSize:17,textAlign:"center",margin:30,color:"#ffffff"}}>
                    No data to display. Please select date, days and device from above list.</Text>
            </View>
        }
    }

    getIndex(){
        for(let temp in this.state.macDevices){
            if(this.state.macDevices[temp].value===this.state.selectedDevice)
                return this.state.macDevices[temp].macId;
        }
        return "";
    }

    getTempHumidData() {
        console.log(this.getIndex());
        this.setState({...this.state,visible:!this.state.visible});
        if(this.state.selectedDays==="1"){
            return fetch("http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getTempHumiOneDayData", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "macid": this.getIndex(),
                    "date": this.state.revisedDate,
                    "days": this.state.selectedDays
                })
            }).then((response) => response.json())
                .then((intermediateResponse) => {
                    console.log(intermediateResponse);
                    return intermediateResponse.data
                })
                .then((responseJson) => {
                    if(responseJson.length===0){
                        this.setState({...this.state,emptyData:true,visible: !this.state.visible});
                        setTimeout(()=>{Alert.alert("Error","No data found!")});
                    }
                    else {
                    let tempTempData = [];
                    let tempTempDataMax = [];
                    let tempTempDataMin = [];
                    let tempDateOrTime = [];
                    let humiTempData = [];
                    let humiTempDataMax = [];
                    let humiTempDataMin = [];
                        for (let i in responseJson.temp) {
                            let iteration = parseInt(i);
                            let temp = Math.round((responseJson.temp[i] - responseJson.temp[i]) * 10) / 10;
                            tempTempData.push({x: iteration + 1, y: temp});
                            tempDateOrTime.push(responseJson.time[i].substr(11, 5));
                            let humi = Math.round((responseJson.humi[i] - responseJson.humi[i]) * 10) / 10;
                            humiTempData.push({x: iteration + 1, y: humi});
                            tempTempDataMax.push({x: iteration + 1, y: responseJson.temp[i]});
                            tempTempDataMin.push({x: iteration + 1, y: responseJson.temp[i]});
                            humiTempDataMax.push({x: iteration + 1, y: responseJson.humi[i]});
                            humiTempDataMin.push({x: iteration + 1, y: responseJson.humi[i]});
                        }
                        this.setState({
                            ...this.state,
                            tempData: tempTempData,
                            humidData: humiTempData,
                            dateOrTime: tempDateOrTime,
                            tempMax: tempTempDataMax,
                            tempMin: tempTempDataMin,
                            humidMax: humiTempDataMax,
                            humidMin: humiTempDataMin,
                            visible: !this.state.visible,
                            emptyData:false
                        });
                    }
                })
                .catch(() => {
                    this.setState({...this.state,visible:!this.state.visible});
                    setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
                });

        }
        else {
            return fetch("http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getTempHumiData", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "macid": this.getIndex(),
                    "date": this.state.revisedDate,
                    "days": this.state.selectedDays
                })
            }).then((response) => response.json())
                .then((intermediateResponse) => {
                    return intermediateResponse.data
                })
                .then((responseJson) => {
                    if(responseJson.length===0){
                        this.setState({...this.state,emptyData:true,visible: !this.state.visible});
                        setTimeout(()=>{Alert.alert("Error","No data found!")});
                    }
                    else {
                        let tempTempData = [];
                        let tempTempDataMax = [];
                        let tempTempDataMin = [];
                        let humiTempData = [];
                        let humiTempDataMax = [];
                        let humiTempDataMin = [];
                        let tempDateOrTime = [];
                        let tempGraphDate = [];
                        for (let i in responseJson.temparatureMaxValues) {
                            let iteration = parseInt(i);
                            let tempDiff = Math.round((responseJson.temparatureMaxValues[i] - responseJson.temparatureMinValues[i]) * 10) / 10;
                            tempTempData.push({x: iteration + 1, y: tempDiff});
                            let alteredDate = (() => {
                                let month = responseJson.date[i].substr(5, 2);
                                let day = responseJson.date[i].substr(8, 2);
                                return day.concat("/", month);
                            })();
                            tempDateOrTime.push(alteredDate);
                            tempGraphDate.push(responseJson.date[i]);
                            let humiDiff = Math.round((responseJson.humidityMaxValues[i] - responseJson.humidityMinValues[i]) * 10) / 10;
                            humiTempData.push({x: iteration + 1, y: humiDiff});
                            tempTempDataMax.push({x: iteration + 1, y: responseJson.temparatureMaxValues[i]});
                            tempTempDataMin.push({x: iteration + 1, y: responseJson.temparatureMinValues[i]});
                            humiTempDataMax.push({x: iteration + 1, y: responseJson.humidityMaxValues[i]});
                            humiTempDataMin.push({x: iteration + 1, y: responseJson.humidityMinValues[i]});
                        }
                        this.setState({
                            ...this.state,
                            tempData: tempTempData,
                            humidData: humiTempData,
                            tempMax: tempTempDataMax,
                            tempMin: tempTempDataMin,
                            humidMax: humiTempDataMax,
                            humidMin: humiTempDataMin,
                            dateOrTime: tempDateOrTime,
                            graphDate: tempGraphDate,
                            visible: !this.state.visible,
                            emptyData:false
                        });
                    }
                })
                .catch(() => {
                    this.setState({...this.state,visible:!this.state.visible});
                    setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
                });
        }
    }

    render() {
        return (
                <ImageBackground
                    style={{flex:1,height:null,width:null}}
                    source={require("../../../assets/wp3.jpg")}
                >
                    <View style={{flex:1}}>
                        <Header
                            outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16",height:65}}
                            leftComponent={this.LeftComponent()}
                            centerComponent={{ text: 'Prahari', style: { color: '#ffffff',fontSize:23 } }}
                            rightComponent={this.RightComponent()}
                        />
                    </View>
                    <View style={{flex:10}}>
            <View style={{flex:1}}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                    <ScrollView>
                <View style={{flex:1,flexDirection:"row",marginBottom:10}}>
                    <View style={{flex:1, marginLeft:5, marginTop:"10%",marginRight:3}}>
                        <TouchableOpacity style={{height:100,marginTop:-20,paddingTop:20}} onPress={this._showDateTimePicker}>
                            <View
                                style={{borderBottomWidth:0.5,
                                    borderBottomColor:"#ffffff",
                                    paddingBottom:8,
                                    backgroundColor:"rgba(0,0,0,0)"
                                }}>
                                <Text style={{color:"#ffffff",fontSize:17}}>
                                    {this.state.selectedDate}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={()=>{this._hideDateTimePicker()}}
                        />
                    </View>
                    <View style={{flex:1, marginLeft:3, marginRight:3}}>
                        <Dropdown
                            label='Days'
                            data={days}
                            fontSize={17}
                            value={this.state.selectedDays}
                            baseColor="#ffffff"
                            textColor="#ffffff"
                            itemColor="rgba(255, 255, 255,1)"
                            selectedItemColor="rgba(255, 255, 255,1)"
                            pickerStyle={{backgroundColor:"rgba(121, 121, 121,0.80)"}}
                            onChangeText={
                                (day)=>{
                                    this.setState({selectedDays:day,tempOrHumid:3,tempButtonColor:"#24a52a",humidButtonColor:"#24a52a"})
                                    console.log(day);
                                }}
                        />
                    </View>
                    <View style={{flex:1,marginLeft:3, marginRight:5}}>
                        <Dropdown
                            label='Select Device'
                            data={this.state.macDevices}
                            fontSize={17}
                            value={this.state.selectedDevice}
                            baseColor="#ffffff"
                            textColor="#ffffff"
                            itemColor="rgba(255, 255, 255,1)"
                            selectedItemColor="rgba(255, 255, 255,1)"
                            pickerStyle={{backgroundColor:"rgba(121, 121, 121,0.80)"}}
                            onChangeText={
                                (device)=>{
                                    this.setState({selectedDevice:device,tempOrHumid:3,tempButtonColor:"#24a52a",humidButtonColor:"#24a52a"})
                                }}
                        />
                    </View>
                </View>
                <View style={{flex:9,marginTop:-25}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Button
                            style={{flex:1,backgroundColor:`${this.state.tempButtonColor}`,borderWidth:0,marginLeft:5,marginRight:5}}
                            onPress={()=> {
                                if(this.state.selectedDate==="Date"||this.state.selectedDays===""||this.state.selectedDevice==="") {
                                    Alert.alert("Input Error","Please choose from date,days and device");
                                }
                                else{
                                this.getTempHumidData().then(() => {
                                    this.setState({tempOrHumid:0,tempButtonColor:"#215424",humidButtonColor:"#24a52a"})
                                })
                            }
                            }}
                        >
                            <Text style={{color:"#ffffff",fontSize:17}}>Temperature</Text>
                        </Button>
                        <Button
                            style={{flex:1,backgroundColor:`${this.state.humidButtonColor}`,borderWidth:0,marginLeft:5,marginRight:5}}
                            onPress={()=>{
                                if(this.state.selectedDate==="Date"||this.state.selectedDays===""||this.state.selectedDevice==="") {
                                    Alert.alert("Input Error","Please choose from date,days and device");
                                }
                                else{
                                this.getTempHumidData().then(()=>{this.setState({...this.state,tempOrHumid:1,humidButtonColor:"#215424",tempButtonColor:"#24a52a"})});
                            }
                            }}
                        >
                            <Text style={{color:"#ffffff",fontSize:17}}>Humidity</Text>
                        </Button>
                    </View>
                    <View style={{flex:10,marginTop:10}}>
                        {this.tempOrHumid()}
                    </View>
                </View>
                    </ScrollView>
            </View>
                    </View>
                </ImageBackground>
        );
    }
}