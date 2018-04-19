import React from 'react';
import {Text,View,StatusBar,Platform,ImageBackground,StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function ShowStatusBar() {
    if (Platform.OS === 'android') {
        return (<StatusBar hidden={true}/>)
    }
    else
        return (null);
}

export default class DisplayGraph extends React.Component{

    static navigationOptions={
        drawerLabel:"Support",
        drawerIcon:({tintColor})=>{
            return (
                <FontAwesome
                    name="envelope"
                    size={25}
                    style={{color: tintColor}}
                >
                </FontAwesome>
            );
        }
    };


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
                <ShowStatusBar/>
                <ImageBackground source={require("../../assets/wp3.jpg")}
                                 style={{flex:1,width:null,height:null}}
                >
                <View style={{flex:1}}>
                    <Header
                        outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16"}}
                        leftComponent={this.LeftComponent()}
                        centerComponent={{ text: 'Support', style: { color: '#ffffff',fontSize:23 } }}
                        rightComponent={this.RightComponent()}
                    />
                </View>
                <View style={{flex:10}}>
                        <View style={{height:"50%"}}>
                        <View style={{flex:2,marginTop:"10%"}}>
                            <Text style={style.companyName}>
                                A S Agri Systems Pvt. Lts., Bangalore
                            </Text>
                        </View>
                        <View style={style.contactView}>
                            <Text style={style.contactTitle}>Contact Person:</Text>
                            <Text style={style.contactDetail}>Santosh Jha</Text>
                        </View>
                            <View style={style.contactView}>
                                <Text style={style.contactTitle}>Contact Number:</Text>
                                <Text style={style.contactDetail}>+91 8197239206</Text>
                            </View>
                            <View style={style.contactView}>
                                <Text style={style.contactTitle}>Email ID:</Text>
                                <Text style={style.contactDetail}>santosh@asagrisystems.com</Text>
                            </View>
                            <View style={style.contactView}>
                                <Text style={style.contactTitle}>Visit Website:</Text>
                                <Text style={style.contactDetail}>www.asagrisystems.com</Text>
                            </View>
                        </View>
                </View>
                </ImageBackground>
            </View>
        )
    }
}

const style=StyleSheet.create({
    companyName:{
        fontSize:22,
        color:"#ffffff",
        marginTop:"5%",
        textAlign:"center"

    },
    contactView:{
        flex:1,
        flexDirection:"row",
        borderBottomColor:"white",
        borderBottomWidth:1
    },
    contactTitle:{
        flex:2,
        marginTop:15,
        marginLeft:15,
        color:"#ffffff",
        fontSize:15
    },
    contactDetail:{
        flex:3,
        marginTop:15,
        color:"#ffffff",
        fontSize:15
    }
});