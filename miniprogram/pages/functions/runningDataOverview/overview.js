import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util";

Page({
  data: {
    deviceTypeIndex: 0,
    realTimePowerChart: {
      lazyLoad: true
    },
    allPower: 0,
    chargingPileAllQuantityTotal: 0,
    windPowerAllGeneratePowerTotal: 0,
    storePowerAllGeneratePowerTotal: 0,
    storeEnergyAllChargingTotal: 0,
    storeEnergyAllDisChargingTotal: 0,
    realTimePowerCurve: {}
  },
  selectDevice(res){
    var typeIndex = res.currentTarget.dataset.index;
    this.setData({
      deviceTypeIndex: typeIndex
    })
    
    var realTimePowerChart = this.selectComponent('#real-time-power-chart');
    var xData = this.data.realTimePowerCurve.xData;
    var yData = this.data.realTimePowerCurve.yDataList[this.data.deviceTypeIndex];
    this.drawChart(realTimePowerChart, xData, yData);
  },
  //市电-电表度数总和
  getCityElecTotal(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/getCityElecTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({allPower: res.result})
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
  onLoad(options) {
  },
  onReady() {
    this.getCityElecTotal();
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
          interval:0
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