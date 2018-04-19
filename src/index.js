import React from 'react';
import {AsyncStorage} from 'react-native'
import {DrawerNavigator} from 'react-navigation';
import DisplayGraph from './components/displayGraph/components/dataGraph';
import AddUsers from './components/addUser/addUser';
import Credits from './components/credits/credits';
import DeviceSettings from './components/deviceSettings/deviceSettings';
import Support from './components/support/support';
import Alerts from './components/alerts/alerts';
import CustomDrawerContentComponent from './components/custonDrawer/customDrawerScreen';


const Navigation= DrawerNavigator(
    {
        dataPage:{
            screen:DisplayGraph
        },
        addUser:{
            screen:AddUsers
        },
        deviceSettings:{
            screen:DeviceSettings
        },
        alerts:{
            screen:Alerts
        },
        support:{
            screen:Support
        },
        credits:{
            screen:Credits
        },
    },
    {
        initialRouteName:'dataPage',
        drawerPosition:'left',
        contentComponent:CustomDrawerContentComponent,
        drawerWidth:300,
        contentOptions:{
            activeTintColor:'green',
            inactiveTintColor:'black'
        }
    }
);



export default class MainApp extends React.Component{

    constructor(){
        super();
        this.state={
            photo:require("./assets/user.png"),
            userDetails:{name:"",mobileNumber:"",email:""}
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('photo', (err, photo) => {
            if(photo) {
                this.setState({photo:JSON.parse(photo)});
            }
        });
        AsyncStorage.getItem('userDetails',(err,userDetails)=>{
            if(userDetails)
                this.setState({userDetails:JSON.parse(userDetails)})
        })
    }

    setPhoto=((photo)=>{
        this.setState({photo:photo});
        AsyncStorage.setItem("photo",JSON.stringify(photo));
    }).bind(this);

    setUserDetails=((userDetails)=>{
        AsyncStorage.setItem("userDetails",JSON.stringify(userDetails));
        this.setState({userDetails:userDetails});
    }).bind(this);

    render(){
        return(
            <Navigation
            screenProps={{
                photo:this.state.photo,
                setPhotoIndex:this.setPhoto,
                setUserDetails:this.setUserDetails,
                userDetails:this.state.userDetails
            }}
            />
        );
    }
}