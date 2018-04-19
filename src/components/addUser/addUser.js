import React from 'react';
import {View,StatusBar,Platform,ImageBackground,AsyncStorage} from 'react-native';
import {Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ReceiveInput from './receiveInput'

function ShowStatusBar(){
        if(Platform.OS==='android'){
            return(<StatusBar hidden={true}/>)
        }
        else
            return null;
}

export default class DisplayGraph extends React.Component{

    static navigationOptions={
        drawerLabel:"User",
        drawerIcon:({tintColor})=>{
            return (
                <FontAwesome
                    name="user"
                    size={25}
                    style={{color: tintColor}}
                >
                </FontAwesome>
            );
        },
    };

    constructor(){
        super();
        this.state={
            photo:require("../../assets/user.png")
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('photo', (err, photo) => {
            if(photo) {
                this.setState({photo:JSON.parse(photo)});
            }
        });
    }

    setPhoto=((photo)=>{
        this.setState({photo:photo});
        AsyncStorage.setItem("photo",JSON.stringify(photo));
        this.props.screenProps.setPhotoIndex(photo);
    }).bind(this);

    setUserDetails=((userDetails)=>{
        this.props.screenProps.setUserDetails(userDetails);
    }).bind(this);

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
            <MaterialIcons
                onPress={()=>(this.props.navigation.navigate("dataPage"))}
                name="home"
                size={35}
                style={{color:"#ffffff"}}
            >
            </MaterialIcons>
        );
    }


    render(){
        return(
            <View style={{flex:1}}>
                <ImageBackground
                    source={require("../../assets/wp3.jpg")}
                    style={{flex:1,width:null,height:null}}
                >
                <View style={{flex:1,marginBottom:11}}>
                <ShowStatusBar/>
                <Header
                    outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16"}}
                    leftComponent={this.LeftComponent()}
                    centerComponent={{ text: 'New Profile', style: { color: '#ffffff',fontSize:23 } }}
                    rightComponent={this.RightComponent()}
                />
                </View>
                <View style={{flex:10}}>
                <ReceiveInput
                    screenProps={{
                        setPhoto:this.setPhoto,
                        photo:this.state.photo,
                        setUserDetails:this.setUserDetails
                    }}
                />
                </View>
                </ImageBackground>
            </View>
        )
    }







}