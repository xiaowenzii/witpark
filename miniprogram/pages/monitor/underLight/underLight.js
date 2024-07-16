import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    deviceList: [],
    todayPower: 0,
    monthPower: 0,
    allPower: 0,
    energyP: 0,
    power: {
      lazyLoad: true
    },
    month: '',
    alarmCount: 0
  },
  // 设备总功率
  getAllDevicePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getAllDevicePowerTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({energyP: res.result})
      }
    }, function(error) {})
  },
  // 总用电量
  getAllUsePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getAllUsePowerTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({allPower: res.result})
      }
    }, function(error) {})
  },
  // 当月用电量
  getCurrentMonthlyUsePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getCurrentMonthlyUsePowerTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({monthPower: res.result})
      }
    }, function(error) {})
  },
  // 日用电量曲线
  getDailyUsePowerCurve(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getDailyUsePowerCurve", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var xData = [];
        var yData = [];
        var m = "";
        for (let i = 0; i < res.result.length; i++) {
          m = res.result[i].collectTime.split('-')[0] + '-' + res.result[i].collectTime.split('-')[1];
          xData.push(parseInt(res.result[i].collectTime.split('-')[2]));
          yData.push(res.result[i].paramValue);
        }
        that.setData({month: m});
        var chart = that.selectComponent('#power-chart');
        that.drawChart(chart, xData, yData);
      }
    }, function(error) {})
  },
  // 今日用电量
  getTodayUsePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getTodayUsePowerTotal", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({todayPower: res.result})
      }
    }, function(error) {})
  },
  // 获取单个设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null){
          that.setData({deviceList: res.data.result});
        }
      }else{
        that.setData({deviceList: []});
      }
    }, function(error) {})
  },
  // 获取告警设备数量
  getAlarmDeviceCount(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestPost("/sps/app/alarm/getAlarmDeviceCount", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null){
          that.setData({alarmCount: res.data.result!=null?parseInt(res.data.result):0})
        }
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});

    this.getAllDevicePowerTotal();
    this.getAllUsePowerTotal();
    this.getCurrentMonthlyUsePowerTotal();
    this.getDailyUsePowerCurve();
    this.getTodayUsePowerTotal();
    this.getDeviceDataList();
    this.getAlarmDeviceCount();
  },
  onReady() {

  },
  //绘制折线图
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
        smooth: false
      }],
      grid:{
        x: 24,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:36,  //距离下边
      }
    };
    var dpr = util.getPixelRatio();
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