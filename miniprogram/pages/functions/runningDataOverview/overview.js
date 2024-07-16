import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util";

Page({
  data: {
    deviceTypeIndex: 0,
    energyStorageDevice: {},
    photovoltaicDevice: {},
    realTimePowerChart: {
      lazyLoad: true
    },
    allPower: 0,
    chargingPileAllQuantityTotal: 0,
    windPowerAllGeneratePowerTotal: 0,
    storePowerAllGeneratePowerTotal: 0,
    storeEnergyAllChargingTotal: 0,
    storeEnergyAllDisChargingTotal: 0,
    realTimePowerCurve: {},
    dataUpdateTime:''
  },
  selectDevice(res){
    var typeIndex = res.currentTarget.dataset.index;
    this.setData({
      deviceTypeIndex: typeIndex
    })
    if(typeIndex==4 || typeIndex==5){
      this.getDeviceTypeRealTimePowerCurveByDeviceTypeId(typeIndex==4?this.data.photovoltaicDevice.deviceTypeId:this.data.energyStorageDevice.deviceTypeId);
    }else{
      var realTimePowerChart = this.selectComponent('#real-time-power-chart');
      var xData = this.data.realTimePowerCurve.xData;
      var yData = this.data.realTimePowerCurve.yDataList[this.data.deviceTypeIndex];
      this.drawChart(realTimePowerChart, xData, yData);
    }
  },
  //今日总用电
  getEnergySavings(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getEnergySavings", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({allPower: res.result.currentDayUsage, dataUpdateTime: util.toDate(res.timestamp)})
      }
    }, function(error) {})
  },
  //充电桩-历史总充电量
  getChargingPileAllQuantityTotal(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getChargingPileAllQuantityTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({chargingPileAllQuantityTotal: res.result})
      }
    }, function(error) {})
  },
  //风力发电-历史总发电量
  getWindPowerAllGeneratePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getWindPowerAllGeneratePowerTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({windPowerAllGeneratePowerTotal: res.result})
      }
    }, function(error) {})
  },
  //光伏发电-历史总发电量
  getStorePowerAllGeneratePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getStorePowerAllGeneratePowerTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({storePowerAllGeneratePowerTotal: res.result})
      }
    }, function(error) {})
  },
  //储能-历史总充电量
  getStoreEnergyAllChargingTotal(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getStoreEnergyAllChargingTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({storeEnergyAllChargingTotal: res.result})
      }
    }, function(error) {})
  },
  //储能-历史总放电量
  getStoreEnergyAllDisChargingTotal(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getStoreEnergyAllDisChargingTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({storeEnergyAllDisChargingTotal: res.result})
      }
    }, function(error) {})
  },
  //设备类型实时功率曲线
  getDeviceTypeRealTimePowerCurve(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getDeviceTypeRealTimePowerCurve", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({realTimePowerCurve: res.result});
        var realTimePowerChart = that.selectComponent('#real-time-power-chart');
        var xData = res.result.xData;
        var yData = res.result.yDataList[that.data.deviceTypeIndex];
        that.drawChart(realTimePowerChart, xData, yData);
      }
    }, function(error) {})
  },
   //设备类型实时功率曲线
   getDeviceTypeRealTimePowerCurveByDeviceTypeId(deviceTypeId){
    let that = this;
    let params = {
      deviceTypeId: deviceTypeId
    }
    util.wxRequestGet("/sps/bigscreen1/getDeviceTypeRealTimePowerCurveByDeviceTypeId", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var realTimePowerChart = that.selectComponent('#real-time-power-chart');
        that.drawChart(realTimePowerChart, res.result.xData, res.result.yData);
      }
    }, function(error) {})
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        for (let i = 0; i < res.result.length; i++) {
          if(res.result[i].deviceTypeName == "储能设备"){
            that.setData({energyStorageDevice: res.result[i]})
          }else if(res.result[i].deviceTypeName == "屋顶光伏"){
            that.setData({photovoltaicDevice: res.result[i]})
          }
        }
      }else{}
    }, function(error) {})
  },
  onLoad(options) {
  },
  onReady() {
    this.getDeviceType();
    this.getEnergySavings();
    this.getChargingPileAllQuantityTotal();
    this.getWindPowerAllGeneratePowerTotal();
    this.getStorePowerAllGeneratePowerTotal();
    this.getStoreEnergyAllChargingTotal();
    this.getStoreEnergyAllDisChargingTotal();
    this.getDeviceTypeRealTimePowerCurve();
  },
  //绘制曲线图
  drawChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval:1
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: yData,
        type: 'line',
        smooth: true
      }],
      grid:{
        x: 48,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:36,  //距离下边
      }
    };
    var dpr = util.getPixelRatio()
    if (chartComponnet) {
      chartComponnet.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        }); 
        chart.setOption(option, true);
        return chart;
      });
    }
  }
})