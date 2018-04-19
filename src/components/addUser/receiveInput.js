import React from 'react';
import {View,Text,Image,Alert,Keyboard,ScrollView} from 'react-native';
import { Hoshi } from 'react-native-textinput-effects';
import { Dropdown } from 'react-native-material-dropdown';
import PhotoUpload from 'react-native-photo-upload';
import Button from "apsl-react-native-button";
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';

const languages=[
    {"value":"English"},
    {"value":"Hindi"}
];

const states=[
    {"value": "Andaman and Nicobar Islands"},
    {"value": "Andhra Pradesh"},
    {"value": "Arunachal Pradesh"},
    {"value": "Assam"},
    {"value": "Bihar"},
    {"value": "Chandigarh"},
    {"value": "Chhattisgarh"},
    {"value": "Dadra and Nagar Haveli"},
    {"value": "Daman and Diu"},
    {"value": "Delhi"},
    {"value": "Goa"},
    {"value": "Gujarat"},
    {"value": "Haryana"},
    {"value": "Himachal Pradesh"},
    {"value": "Jammu and Kashmir"},
    {"value": "Jharkhand"},
    {"value": "Karnataka"},
    {"value": "Kerala"},
    {"value": "Lakshadweep"},
    {"value": "Madhya Pradesh"},
    {"value": "Maharashtra"},
    {"value": "Manipur"},
    {"value": "Meghalaya"},
    {"value": "Mizoram"},
    {"value": "Nagaland"},
    {"value": "Odisha"},
    {"value": "Puducherry"},
    {"value": "Punjab"},
    {"value": "Rajasthan"},
    {"value": "Sikkim"},
    {"value": "Tamil Nadu"},
    {"value": "Telangana"},
    {"value": "Tripura"},
    {"value": "Uttar Pradesh"},
    {"value": "Uttarakhand"},
    {"value": "West Bengal"}
];

export default class ReceiveInput extends React.Component {

    constructor(props){
        super();
        this.state= {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            district: "",
            selectedState: "",
            selectedLanguage: "",
            photo:props.screenProps.photo,
            visible:false
        }
    }

    componentDidMount(){
        fetch(`http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/getProfile1/${DeviceInfo.getUniqueID()}`,{
            method:"GET",
            header:{'Accept': 'application/json'}
        })
            .then((response)=>response.json())
            .then((response)=>{
                if(response.statusCode===200){
                    this.setState({...this.state,
                        firstName:response.data[0].firstName,
                        lastName:response.data[0].lastName,
                        email:response.data[0].emaiId,
                        selectedLanguage:response.data[0].language,
                        mobileNumber:response.data[0].mobileNo,
                        district:response.data[0].line1,
                        selectedState:response.data[0].state,
                    });
                }
            });
        setTimeout(()=>{this.setState({photo:this.props.screenProps.photo})},50)
    }

    profileData(){
        this.setState({...this.state,visible:true});

        let formData=new FormData();
        formData.append("emailId",this.state.email);
        formData.append("mobileNo",this.state.mobileNumber);
        formData.append("language",this.state.selectedLanguage);
        formData.append("firstName",this.state.firstName);
        formData.append("lastName",this.state.lastName);
        formData.append("line1",this.state.district);
        formData.append( "state",this.state.selectedState);
        formData.append("deviceId",DeviceInfo.getUniqueID());

        return fetch('http://prodapp.agrisensorsandcontrols.com:8080/AgriSensors/spadc/createProfile1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:formData
        }).then((response) => {return response.json()})
            .then((response)=>{
                this.setState({visible:false});
                this.props.screenProps.setPhoto(this.state.photo);
                let userDetails={name:this.state.firstName.concat(" ",this.state.lastName),mobileNumber:this.state.mobileNumber,email:this.state.email};
                this.props.screenProps.setUserDetails(userDetails);
                setTimeout(()=>{Alert.alert("alert",response.message)});
            })
            .catch(() => {
                this.setState({visible:false});
                setTimeout(()=>{Alert.alert("Error","Network error! Please try again");})
            });
    };




    render() {

        return (
            <View style={{flex:1}}>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF'}} />
                <ScrollView>
                    <View style={{flex:1,width:"90%", marginLeft:"5%"}}>
                        <Hoshi
                            style={{borderBottomColor:"white",borderBottomWidth:0.5}}
                            labelStyle={{ color: 'white', fontSize:18}}
                            inputStyle={{ color: 'white' }}
                            value={this.state.firstName}
                            label={'First Name'}
                            borderColor={'green'}
                            autoCapitalize={'words'}
                            autoCorrect={false}
                            onChangeText={(data)=>{this.setState({...this.state,firstName:data})}}
                            onBlur={()=>{Keyboard.dismiss();}}
                        />
                        <Hoshi
                            style={{borderBottomColor:"white",borderBottomWidth:0.5}}
                            labelStyle={{ color: 'white', fontSize:18}}
                            inputStyle={{ color: 'white' }}
                            value={this.state.lastName}
                            label={'Last Name'}
                            borderColor={'green'}
                            autoCapitalize={'words'}
                            autoCorrect={false}
                            onChangeText={(data)=>{this.setState({...this.state,lastName:data})}}
                            onBlur={()=>{Keyboard.dismiss();}}
                        />
                        <Hoshi
                            style={{borderBottomColor:"white",borderBottomWidth:0.5}}
                            labelStyle={{ color: 'white', fontSize:18}}
                            inputStyle={{ color: 'white' }}
                            value={this.state.email}
                            label={'EmailID'}
                            borderColor={'green'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(data)=>{this.setState({...this.state,email:data})}}
                            onBlur={()=>{Keyboard.dismiss();}}
                        />
                        <Hoshi
                            style={{borderBottomColor:"white",borderBottomWidth:0.5}}
                            labelStyle={{ color: 'white', fontSize:18}}
                            inputStyle={{ color: 'white' }}
                            value={this.state.mobileNumber}
                            label={'Mobile Number'}
                            borderColor={'green'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(data)=>{this.setState({...this.state,mobileNumber:data})}}
                            onBlur={()=>{Keyboard.dismiss();}}
                        />
                        <Hoshi
                            style={{borderBottomColor:"white",borderBottomWidth:0.5}}
                            labelStyle={{ color: 'white', fontSize:18}}
                            inputStyle={{ color: 'white' }}
                            value={this.state.district}
                            label={'District'}
                            borderColor={'green'}
                            autoCapitalize={'words'}
                            autoCorrect={false}
                            onChangeText={(data)=>{this.setState({...this.state,district:data})}}
                            onBlur={()=>{Keyboard.dismiss();}}
                        />
                        <Dropdown
                            label='  Select State'
                            data={states}
                            fontSize={18}
                            baseColor="rgba(255,255,255,1)"
                            textColor="rgba(255, 255, 255,1)"
                            itemColor="rgba(255, 255, 255,1)"
                            selectedItemColor="rgba(255, 255, 255,1)"
                            pickerStyle={{backgroundColor:"rgba(121, 121, 121,0.80)"}}
                            value={this.state.selectedState}
                            onChangeText={
                                (state)=>{
                                    this.setState({...this.state,selectedState:state})
                                }}
                        />
                        <Dropdown
                            label='  Select Language'
                            data={languages}
                            fontSize={18}
                            baseColor="rgba(255,255,255,1)"
                            textColor="rgba(255, 255, 255,1)"
                            itemColor="rgba(255, 255, 255,1)"
                            selectedItemColor="rgba(255, 255, 255,1)"
                            pickerStyle={{backgroundColor:"rgba(121, 121, 121,0.80)"}}
                            value={this.state.selectedLanguage}
                            onChangeText={
                                (language)=>{
                                    this.setState({...this.state,selectedLanguage:language})
                                }}
                        />
                        <View style={{flexDirection:"row",marginTop:10}}>
                            <Text
                                style={{ color:"white",fontSize:18,marginTop:30}}
                            >  Upload Photo</Text>
                            <PhotoUpload
                                onPhotoSelect={avatar => {
                                    if (avatar) {
                                            this.setState({photo:{uri:`data:image/JPG;base64,${avatar}`}});
                                    }
                                }}
                            >
                                <Image
                                    style={{
                                        marginLeft:70,
                                        paddingVertical: 30,
                                        width: 100,
                                        height: 100,
                                        borderRadius: 50
                                    }}
                                    resizeMode='cover'
                                    source={this.state.photo}
                                    />
                            </PhotoUpload>
                        </View>

                        <Button
                            style={{backgroundColor:"#24a52a",borderWidth:0,marginTop:15}}
                            onPress={()=>{this.profileData()}}
                        >
                            <Text style={{color:"#ffffff",fontSize:18}}>Add User</Text>
                        </Button>
                    </View>
                </ScrollView>
            </View>
        );
    }
}