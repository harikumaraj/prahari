import React from 'react';
import {Text,ScrollView,TouchableOpacity,View,Platform,ImageBackground,Image} from 'react-native';
import {DrawerItems,SafeAreaView} from 'react-navigation'

export default CustomDrawerContentComponent = (props) => {

    return(
        <SafeAreaView style={{flex: 1}} forceInset={{top: 'always', horizontal: 'never'}}>
            <View
                style={{
                    marginTop:(Platform.OS==="ios")?"-8%":0,
                    width: "100%",
                    height: 200,
                    justifyContent:"flex-end"
                }}
            >
                <ImageBackground
                    style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}
                    source={require("../../assets/google1.png")}
                >
                    <TouchableOpacity
                        style={{
                            height:100,
                            width:100,
                            borderRadius:50,
                        }}
                        onPress={()=>{props.navigation.navigate("addUser")}}
                    >
                        <Image
                            style={{width:100,height:100,borderRadius:50}}
                            source={props.screenProps.photo}
                        />
                    </TouchableOpacity>
                    <Text style={{marginTop:"2%",color:"#ffffff",backgroundColor:"rgba(0,0,0,0)"}}>{props.screenProps.userDetails.name}</Text>
                    <Text style={{color:"#ffffff",backgroundColor:"rgba(0,0,0,0)"}}>{props.screenProps.userDetails.mobileNumber}</Text>
                    <Text style={{color:"#ffffff",backgroundColor:"rgba(0,0,0,0)"}}>{props.screenProps.userDetails.email}</Text>
                </ImageBackground>
            </View>
            <ScrollView>
                <DrawerItems {...props}/>
            </ScrollView>
        </SafeAreaView>
    );
}