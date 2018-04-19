import React,{Component} from 'react';
import {Text,View,ScrollView,Alert} from 'react-native';
import {VictoryChart,VictoryAxis,VictoryArea,VictoryTheme} from 'victory-native';

export default class HumidityGraph extends Component{

    constructor(props) {
        super(props);
        var valMax = ["Maximum"];
        var valMin = ["Minimum"];
        let tableData = ["Difference"];
        for (let index in this.props.humidMax) {
            valMax.push(this.props.humidMax[index].y);
            valMin.push(this.props.humidMin[index].y);
            tableData.push(this.props.data[index].y);
        }
        this.state = {
            data: props.data,
            humidMax: props.humidMax,
            humidMin: props.humidMin,
            dateList: props.humidDateOrTime,
            graphDate:this.props.graphDate,
            days: props.days,
            humidMaxTable: valMax,
            humidMinTable: valMin,
            listDataTable: tableData,
            date:this.props.date,
            oneDayMax:0,
            oneDayMin:0,
            tickValues:this.props.tempDateOrTime,
            tickCount:0,
            width: 0,
            domain:{},
            oneDayData:[],
            tempIterations:0,

        };
    }

    determineMonth(month){
        switch(month){
            case "01":return "Jan";break;
            case "02":return "Feb";break;
            case "03":return "Mar";break;
            case "04":return "Apr";break;
            case "05":return "May";break;
            case "06":return "Jun";break;
            case "07":return "Jul";break;
            case "08":return "Aug";break;
            case "09":return "Sep";break;
            case "10":return "Oct";break;
            case "11":return "Nov";break;
            case "12":return "Dec";break;
        }
    }

    componentWillMount() {
        if (parseInt(this.state.days) === 1) {
            let temporaryDataDayOne = [];
            let temporaryTempMaxDayOne = [];
            let temporaryTempMinDayOne = [];
            let temporaryTimeListDayOne = [];
            let valMax = ["Maximum"];
            let valMin = ["Minimum"];
            let tableData = ["Difference"];
            let interval = this.state.humidMin.length / 24;
            for (let i = 0; i < 24; i++) {
                temporaryDataDayOne.push({x: i + 1, y: this.state.humidMax[Math.floor(i * interval)].y});
                temporaryTempMaxDayOne.push({x: i + 1, y: this.state.humidMax[Math.floor(i * interval)].y});
                temporaryTempMinDayOne.push({x: i + 1, y: this.state.humidMax[Math.floor(i * interval)].y});
                temporaryTimeListDayOne.push(this.state.dateList[Math.floor(i * interval)]);
                valMax.push(this.state.humidMax[Math.floor(i * interval)].y);
                valMin.push(this.state.humidMin[Math.floor(i * interval)].y);
                tableData.push(this.props.data[Math.floor(i * interval)].y);
            }
            this.setState({
                ...this.state,
                tickValues: temporaryTimeListDayOne,
                tickCount: 24,
                width: 960,
                domain: {x: [1, 24]},
                data: temporaryDataDayOne,
                humidMax: temporaryTempMaxDayOne,
                humidMin: temporaryTempMinDayOne,
                dateList: temporaryTimeListDayOne,
                humidMaxTable: valMax,
                humidMinTable: valMin,
                listDataTable: tableData,
                tempIterations: 24,

            });
        } else {
            let newDateList = [];
            this.state.graphDate.map((date) => {
                let newDate = this.determineMonth(date.substr(5, 2));
                newDateList.push(date.substr(8, 2).concat(" ", newDate));
            });
            if (parseInt(this.state.days) === 30) {
                this.setState({
                    ...this.state,
                    tickValues: this.state.dateList,
                    tickCount: 30,
                    width: 1200,
                    domain: {x: [1, 30]},
                    dateList: newDateList,
                    tempIterations: 30,
                });
            } else {
                this.setState({
                    ...this.state,
                    tickValues: this.state.dateList,
                    tickCount: 7,
                    width: 400,
                    domain: {x: [1, 7]},
                    dateList: newDateList,
                    tempIterations: 7,
                });
            }
        }
    }

    tableForOneOrMultipleDays() {
        if (this.state.days === "1") {
            let data=this.state.humidMaxTable;
            data.shift();
            return(
                <View style={{flex:1}}>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"center"}}>
                        <View style={{width:100,height:40}}></View>
                        <Text style={{fontSize:15,color:"#ffffff"}}>{this.state.date.substr(0,6)}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text style={{width:100,height:40,color:"#ffffff",textAlign:"center",justifyContent:"center",fontSize:15,fontWeight:"bold"}}>Maximum</Text>
                        <Text style={{width:100,height:40,color:"#ffffff",textAlign:"center",justifyContent:"center",fontSize:15,fontWeight:"bold"}}>{Math.max(...data)}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text style={{width:100,height:40,color:"#ffffff",textAlign:"center",justifyContent:"center",fontSize:15,fontWeight:"bold"}}>Minimum</Text>
                        <Text style={{width:100,height:40,color:"#ffffff",textAlign:"center",justifyContent:"center",fontSize:15,fontWeight:"bold"}}>{Math.min(...data)}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <Text style={{width:100,height:40,color:"#ffffff",textAlign:"center",justifyContent:"center",fontSize:15,fontWeight:"bold"}}>Difference</Text>
                        <Text style={{width:100,height:40,color:"#ffffff",textAlign:"center",justifyContent:"center",fontSize:15,fontWeight:"bold"}}>{(Math.max(...data)-Math.min(...data)).toFixed(1)}</Text>
                    </View>
                </View>

            );
        }
        else
        {
            return(
                <View style={{flex:1}}>
                    <View style={{flex:1,flexDirection:"row"}}>
                        <View style={{width:100,height:50}}></View>
                        {
                            this.state.dateList.map((date,index)=>
                                <View key={index} style={{
                                    width:100,
                                    height:50,
                                    alignItems:"center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{fontSize:15,color:"#ffffff"}}>{date}</Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={{flex:1,flexDirection:"row"}}>
                        {
                            this.state.humidMaxTable.map((maxHumid,index)=>
                                <View key={index} style={{
                                    width:100,
                                    height:50,
                                    alignItems:"center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{fontSize:15,color:"#ffffff",fontWeight:"bold"}}>{maxHumid}</Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={{flex:1,flexDirection:"row"}}>
                        {
                            this.state.humidMinTable.map((minHumid,index)=>
                                <View key={index} style={{width:100,
                                    height:50,
                                    alignItems:"center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{fontSize:15,color:"#ffffff",fontWeight:"bold"}}>{minHumid}</Text>
                                </View>
                            )
                        }
                    </View>
                    <View style={{flex:1,flexDirection:"row"}}>
                        {
                            this.state.listDataTable.map((temp,index)=>
                                <View key={index} style={{
                                    width:100,
                                    height:50,
                                    alignItems:"center",
                                    justifyContent:"center"
                                }}>
                                    <Text style={{fontSize:15,color:"#ffffff",fontWeight:"bold"}}>{temp}</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
            );
        }
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:"rgba(255,255,255,0)"}}>

                <View style={{flex:2}}>
                    <ScrollView  horizontal>
                        {this.tableForOneOrMultipleDays()}
                    </ScrollView>
                </View>
                <View style={{flex:8,backgroundColor:"rgba(255,255,255,0.5)",marginTop:20}}>
                    <View>
                    <ScrollView horizontal>
                        <VictoryChart
                            style={{
                                parent:{marginTop:-30},
                            }}
                            width={this.state.width}
                            height={400}
                            theme={VictoryTheme.material}
                            domain={{y: [1, 110]}}
                        >
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(t) => `${t}°`}
                                domain={{y: [1, 60]}}
                                tickCount={14}
                            />
                            <VictoryAxis
                                crossAxis
                                domain={this.state.domain}
                                tickCount={this.state.tickCount}
                                tickValues={this.state.tickValues}
                            />
                            <VictoryArea
                                style={{data: {fill: "#17eae3",fillOpacity: 0.5, stroke: "#135654", strokeWidth: 2}}}
                                interpolation="natural"
                                data={this.state.humidMax}
                            />
                            <VictoryArea
                                style={{data: {fill: "#7bf27b",fillOpacity: 0.5, stroke: "#1e5b1e", strokeWidth: 2}}}
                                interpolation="natural"
                                data={this.state.humidMin}
                            />
                            <VictoryArea
                                style={{data: {fill: "#f72023",fillOpacity: 0.5, stroke: "#631718", strokeWidth: 2}}}
                                interpolation="natural"
                                labels={(dataVal) => {
                                    if(dataVal.eventKey===0||dataVal.eventKey===this.state.tempIterations-1)return "";
                                    return dataVal.y}}
                                data={this.state.data}
                            />
                        </VictoryChart>
                    </ScrollView>
                        <View style={{flex:1,alignItems:"flex-end",justifyContent:"center"}}>
                            <View style={{
                                flex:1,
                                flexDirection:"row",
                                justifyContent:"center",
                                marginTop:10,
                                width:250,
                                borderRadius:4
                            }}>
                                <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <View style={{width:20,height:13,backgroundColor:"rgb(23, 234, 227)"}}></View>
                                    <Text style={{marginRight:10,color:"#000000",fontSize:10}}>=Maximum</Text>
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <View style={{width:20,height:13,backgroundColor:"rgb(123, 242, 123)"}}></View>
                                    <Text style={{marginRight:10,color:"#000000",fontSize:10}}>=Minimum</Text>
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <View style={{width:20,height:13,backgroundColor:"rgb(247, 32, 35)"}}></View>
                                    <Text style={{marginRight:10,color:"#000000",fontSize:10}}>=Difference</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
