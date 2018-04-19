import React from 'react';
import {Text,View,StatusBar,Platform,ImageBackground,Image,StyleSheet} from 'react-native';
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

export default class DisplayGraph extends React.Component {

    static navigationOptions = {
        drawerLabel: "Credits",
        drawerIcon: ({tintColor}) => {
            return (
                <FontAwesome
                    name="info-circle"
                    size={25}
                    style={{color: tintColor}}
                >
                </FontAwesome>
            );
        }
    };

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


    render() {
        return (
            <View style={{flex: 1}}>
                <ShowStatusBar/>
                <ImageBackground
                    style={{flex: 1, width: null, height: null}}
                    source={require("../../assets/wp3.jpg")}
                >
                <View style={{flex: 1}}>
                    <Header
                        outerContainerStyles={{backgroundColor:"#1baf16",borderBottomColor:"#1baf16"}}
                        leftComponent={this.LeftComponent()}
                        centerComponent={{text: 'Credits', style: {color: '#ffffff', fontSize: 23}}}
                        rightComponent={this.RightComponent()}
                    />
                </View>
                <View style={{flex: 10}}>
                        <View style={{flex:1, alignItems:"center",justifyContent:"center"}}>
                            <Text style={styles.title}>प्रहरी</Text>
                            <Text style={styles.version}>Version 1.0</Text>
                            <Image
                                source={require("../../assets/icon.png")}
                                style={{height:150,width:150}}
                            />
                            <Text style={{color:"#ffffff", fontSize:15,margin:10,textAlign:"center"}}>
                                Designed and Developed by AppFace Technology Pvt., Ltd.
                            </Text>
                            <Text style={styles.info}>www.appface.in</Text>
                            <Text style={styles.info}>Email: contact@appface.in</Text>
                        </View>
                </View>
                </ImageBackground>
            </View>
        )
    }
}


const styles=StyleSheet.create({
    title:{
        color:"#ffffff",
        fontSize:33,
        margin:10
    },
    version:{
        color:"#ffffff",
        fontSize:18,
        marginBottom:15
    },
    info:{
        color:"#ffffff",
        fontSize:16,
    }

});