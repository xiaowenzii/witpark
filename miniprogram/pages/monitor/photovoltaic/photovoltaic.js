import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceData:{},
    deviceTypeId: '',
    detailData:{},
    powerData:{},
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
        if(res.data.result != null && res.data.result.length > 0){
          that.setData({deviceData: res.data.result[0]});
          that.getLatestData();
        }
      }
    }, function(error) {})
  },
  // 获取最新实时数据
  getLatestData(){
    let that = this;
    let deviceParams = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceData.deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/solarPower/getLatestData", "加载中...", deviceParams, 'application/json', function(res) {
      if(res.success){
        if(res.result != null){
          that.setData({detailData: res.result})
          that.getPhotovoltaicOperationStatus();
        }
      }
    }, function(error) {})
  },
  // 获取发电信息
  getPhotovoltaicOperationStatus(){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceData.deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/solarPower/getPhotovoltaicOperationStatus", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({powerData: res.result});
        that.getSolarPowerTrend();
      }
    }, function(error) {})
  },
  // 获取实时功率
  getSolarPowerTrend(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestGet("/sps/app/device/solarPower/getSolarPowerTrend", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
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
          textStyle: {fontSize: 8}
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