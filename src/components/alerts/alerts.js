import React from 'react';
import {View,StatusBar,Platform,ImageBackground,Text,ScrollView,Alert,RefreshControl,Image} from 'react-native';
import {Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';

function ShowStatusBar() {
    if (Platform.OS === 'android') {
        return (<StatusBar hidden={true}/>)
    }
    else
        return (null);
}

export default class Alerts extends React.Component {

    static navigationOptions = {
        drawerLabel: "Alerts",
        drawerIcon: ({tintColor}) => {
            return (
                <FontAwesome
                    name="bell"
                    size={25}
                    style={{color: tintColor}}
                >
                </FontAwesome>
            );
        }
    };

    constructor(){
        super();
        this.state= {
            startPoint: 1,
            endPoint: 20,
            data:[],
            visible:false,
            refreshing: false,
            imageSource:"",
            alertTitle:""
        };
    }

    getImageSourceAndTitle(typeOfAlert){
        switch(typeOfAlert){
            case "increased pointsAlert":
                return {alertTitle:"Increased points alert",imageSource:require("../../assets/arrowUp.png")};
            case "two nightsAlert":
                return {alertTitle:"Two nights alert",imageSource:require("../../assets/moon.png")};
            case "temp diffAlert":
                return {alertTitle:"Temperature difference alert",imageSource:require("../../assets/tempDiff.png")};
            case "temp minAlert":
                return {alertTitle:"Temperature minimum alert",imageSource:require("../../assets/tempLow.png")};
            case "temp maxAlert":
                return {alertTitle:"Temperature maximum alert",imageSource:require("../../assets/tempHigh.png")};
        }
    }

    dateAndTimeToDisplay(date) {
        let tempDate=date.replace(/-/g, "/");
        let curDate = new Date().getTime();
        let givenDate =new Date(tempDate).getTime();
            let timeDiff=Math.floor((curDate-givenDate)/60000);
        if(timeDiff<=0){
            return "now";
        }
        if(timeDiff<60){
            return `${Math.floor(timeDiff)} minutes ago`
        }
        else if(timeDiff>=60 && timeDiff/60<24){
            return `${Math.floor(timeDiff/60)} hours ago`
        }
        else if(timeDiff/60>=24 && timeDiff/(60*24)<30){
            return `${Math.floor(timeDiff/(60*24))} days ago`
        }
        else if(timeDiff/(60*24)>=30 && timeDiff/(60*24*30)<12){
            return `${Math.floor(timeDiff/(60*24*30))} months ago`
        }
        else if(timeDiff/(60*24*30)>=12){
            return `${Math.floor(timeDiff/(60*24*365))} years ago`
        }
    }

    getNotification(){
        return fetch("http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getNotifications", {
            method: "POST",
            headers: {
                "accept":"application/json",
                "content-type":"application/json"
            },
            body: JSON.stringify({
                "deviceId":DeviceInfo.getUniqueID(),
                "from":this.state.startPoint,
                "to":this.state.endPoint
            })
        }).then((response)=>response.json())
            .then((response)=>{
            let tempNotificationData=[];
            response.data.map((notification)=>{
                let newNotification=notification;
                let imageSrcAndAlertTitle=this.getImageSourceAndTitle(notification.typeOfAlert);
                newNotification["imageSource"]=imageSrcAndAlertTitle.imageSource;
                newNotification.typeOfAlert=imageSrcAndAlertTitle.alertTitle;
                tempNotificationData.push(newNotification);
            });
            this.setState({...this.state,data:tempNotificationData,visible:false});})
            .catch(() => {
                this.setState({...this.state,visible:false});
                setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
            });
    }

    componentDidMount(){
        this.setState({...this.state,visible:true});
        return this.getNotification();
    }

    displayNotifications(){
        if(this.state.data===[]){
            return(
                <Text
                style={{fontSize:17,color:"#ffffff",marginTop:100,textAlign:"center"}}
                >
                    No notifications to display
                </Text>
            )
        }
        else{
            return(
                this.state.data.map((notification)=> {
                        return (
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingRight: 10,
                                    paddingLeft: 10,
                                    backgroundColor: "#ffffff",
                                    borderRadius: 5,
                                    margin: 5
                                }}
                            >
                                <View style={{flex: 1,alignItems:"center",justifyContent:"center"}}>
                                    <Image
                                    style={{width:80,height:80}}
                                    source={notification.imageSource}
                                    />
                                </View>
                                <View
                                    style={{flex: 10, padding: 10}}
                                >
                                    <Text
                                        style={{color: "#000000", marginTop: 10}}
                                    >
                                        {notification.typeOfAlert}
                                    </Text>
                                    <View style={{flexDirection: "row", margin: 5}}>
                                        <Text
                                            style={{color: "#000000"}}
                                        >
                                            {notification.macIdName}
                                        </Text>
                                        <Text
                                            style={{color: "#000000"}}
                                        >
                                            ({notification.macId})
                                        </Text>
                                    </View>
                                    <Text
                                        style={{color: "#000000"}}
                                    >
                                        {notification.alertMessage}
                                    </Text>
                                    <View>
                                        <Text
                                            style={{color: "#000000", marginBottom: 10, marginTop: 5, textAlign: "right"}}
                                        >
                                            {this.dateAndTimeToDisplay(notification.timeOfSent)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                )
            )
        }
    }
    _onRefresh() {
        this.setState({refreshing: true});
        this.getNotification().then(() => {
            this.setState({refreshing: false});
        });
    }

    LeftComponent() {
        return (
            <MaterialIcons
                onPress={() => (this.props.navigation.navigate("DrawerOpen"))}
                name="menu"
                size={35}
                style={{color: "#ffffff"}}
            >
            </MaterialIcons>
        );
    }

    RightComponent() {
        return (
            <MaterialIcons
                onPress={() => (this.props.navigation.navigate("dataPage"))}
                name="home"
                size={35}
                style={{color: "#ffffff"}}
            >
            </MaterialIcons>
        );
    }

    render(){
        return(
            <View style={{flex:1}}>
                <ShowStatusBar/>
                <ImageBackground
                    style={{flex:1,height:null,width:null}}
                    source={require("../../assets/wp3.jpg")}
                >
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                    <View style={{flex:1,marginBottom:-14}}>
                        <Header
                            outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16"}}
                            leftComponent={this.LeftComponent()}
                            centerComponent={{ text: 'Alerts', style: { color: '#ffffff',fontSize:23 } }}
                            rightComponent={this.RightComponent()}
                        />
                    </View>
                    <View style={{flex:10}}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                            scrollEventThrottle={200}
                            onScroll={(e) => {
                                let paddingToBottom = 10;
                                paddingToBottom += e.nativeEvent.layoutMeasurement.height;
                                if(e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height - paddingToBottom) {
                                    this.setState({endPoint:this.state.endPoint+20,visible:true});
                                    this.getNotification();
                                }
                            }}
                        >
                            {this.displayNotifications()}
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}