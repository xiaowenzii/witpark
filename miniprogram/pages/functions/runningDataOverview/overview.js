import * as echarts from '../../component/ec-canvas/echarts';
import * as util from "../../../utils/util";

Page({
  data: {
    todayDate: '',
    realTimePowerChart: {
      lazyLoad: true
    },
    deviceTypeIndex: 0,
    powerDeviceType:[
      {deviceName: '园区总功率', deviceType: 'park'},
      {deviceName: '空调功率', deviceType: 'airConditioner'},
      {deviceName: '照明功率', deviceType: 'light'},
      {deviceName: '屋顶光伏', deviceType: 'solarPower'},
      {deviceName: '光伏花', deviceType: 'solarFlower'},
      {deviceName: '风力发电', deviceType: 'wind'},
      {deviceName: '风光储路灯', deviceType: 'streetlight'},
      {deviceName: '储能', deviceType: 'storage'}
    ],
    realTimePowerChart: null
  },
  selectDevice(res){
    var typeIndex = res.currentTarget.dataset.index;
    this.setData({
      deviceTypeIndex: typeIndex
    })
    if(typeIndex==0 || typeIndex==1 || typeIndex==2){
      this.getRealtimePowerCurveData(this.data.powerDeviceType[typeIndex].deviceType);
    }else{
      this.getGreenPowerCurveData(this.data.powerDeviceType[typeIndex].deviceType);
    }
  },
  // 获得光储充汇总数据
  getSummaryData(){
    let that = this;
    let params = {
      type: 'day',
      time: that.data.todayDate
    }
    util.wxRequestGet("/prod-api/business/energyVisualization/getRealtimePowerCurveData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        this.setData({
          summaryData: res.data
        })
      }
    }, function(error) {})
  },
  //用电实时功率曲线实时数据获取 支持按设备类型筛选：park-园区, airConditioner-空调, light-照明
  getRealtimePowerCurveData(deviceType){
    let that = this;
    let params = {
      deviceTypeId: deviceType
    }
    util.wxRequestGet("/prod-api/business/energyVisualization/getRealtimePowerCurveData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(that.data.realTimePowerChart == null){
          that.data.realTimePowerChart = that.selectComponent('#real-time-power-chart');
        }
        let rYData = [{
          type: 'line', 
          titles: [],
          colors: ['#16A6C2'],
          data: [[]]
        }];
        let rData = res.data.timeAxis;
        rYData[0].data[0] = res.data.numericalAxis;
        util.drawMixEChart(echarts, that.data.realTimePowerChart, rData, rYData, Math.ceil(rData.length/12));
      }
    }, function(error) {})
  },
  //绿电曲线实时数据获取 支持按设备类型筛选：solarPower-屋顶光伏, solarFlower-光伏场, wind-风力发电, storage-储能, streetlight-风光储路灯
  getGreenPowerCurveData(deviceType){
    let that = this;
    let params = {
      deviceTypeId: deviceType
    }
    util.wxRequestGet("/prod-api/business/energyVisualization/greenPowerCurveData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(that.data.realTimePowerChart == null){
          that.data.realTimePowerChart = that.selectComponent('#real-time-power-chart');
        }
        let pYData = [{
          type: 'line', 
          titles: [],
          colors: ['#16A6C2'],
          data: [[]]
        }];
        let xData = res.data.timeAxis;
        pYData[0].data[0] = res.data.numericalAxis;
        util.drawMixEChart(echarts, that.data.realTimePowerChart, xData, pYData, Math.ceil(xData.length/12));
      }
    }, function(error) {})
  },
  onLoad(options) {
  },
  onReady() {
    // 获取当前日期
    const date = new Date();
    this.setData({
      todayDate: date.getFullYear() + '.' + util.formatMD(date.getMonth() + 1) + '.' + util.formatMD(date.getDate())
    })
    this.getSummaryData(); // 获得光储充汇总数据
    this.getRealtimePowerCurveData(this.data.powerDeviceType[0].deviceType);
  }
})