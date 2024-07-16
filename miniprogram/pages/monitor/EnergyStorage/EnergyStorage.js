import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceData: {},
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData:{},
    curStateData:{},
    incomeData:{},
    ec: {
      lazyLoad: true
    }
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result!=null && res.data.result.length>0){
          that.setData({deviceData: res.data.result[0]});
          that.getEnergyStorageBaseOne();
        }
      }
    }, function(error) {})
  },
  // 获取储能基本信息
  getEnergyStorageBaseOne(){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceData.deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/storeEnergy/getEnergyStorageBaseOne", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({detailData: res.result});
        that.getLatestData();
      }
    }, function(error) {})
  },
  // 获取最新实时数据
  getLatestData(){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceData.deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/storeEnergy/getLatestData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({curStateData: res.result})
        that.getRawEnergyPowerComparisons();
      }
    }, function(error) {})
  },
  // 储能用电对比，收益
  getRawEnergyPowerComparisons(){
    let that = this;
    util.wxRequestGet("/sps/app/device/storeEnergy/getRawEnergyPowerComparisons", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({incomeData: res.result});
        that.getPowerTrend();
      }
    }, function(error) {})
  },
  // 获取储能实时功率曲线
  getPowerTrend(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
    }
    util.wxRequestGet("/sps/app/device/storeEnergy/getPowerTrend", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var energyChart = that.selectComponent('#energy-power-chart');
        that.drawChart(energyChart, res.result.xData, res.result.yData)
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getDeviceDataList();
  },

  onReady() {
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
        type: 'value',
        axisLabel:{
          textStyle: {fontSize: 10}
        }
      },
      series: [{
        data: yData,
        type: 'line',
        smooth: false
      }],
      grid:{
        x: 24,  //距离左边
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