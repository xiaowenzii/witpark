import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceList: [],
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData:{status: '', chargeCount: 0, power: 0, chargeTime: 0, earn: 0, detail:{}},
    yearAndMonth: '',
    monthp: {
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
        if(res.data.result != null){
          that.setData({deviceList: res.data.result});
          if(res.data.result.length > 0){
            that.getChargingStatus();
            that.getTodayDifftimeTotal();
            that.getTodayOrderCount();
            that.getTodayProfitsTotal();
            that.getTodayQuantityTotal();
            that.refreshDevice();
            that.getDailyChargingCurve();
          }
        }
      }
    }, function(error) {})
  },
  // 充电桩工作状态
  getChargingStatus(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/chargingPile/getChargingStatus", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detail = that.data.detailData;
        detail.status = res.result;
        that.setData({detailData: detail})
      }
    }, function(error) {})
  },
  // 今日充电时长
  getTodayDifftimeTotal(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayDifftimeTotal", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detail = that.data.detailData;
        detail.chargeTime = res.result;
        that.setData({detailData: detail})
      }
    }, function(error) {})
  },
  // 今日充电次数
  getTodayOrderCount(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayOrderCount", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detail = that.data.detailData;
        detail.chargeCount = res.result;
        that.setData({detailData: detail})
      }
    }, function(error) {})
  },
  // 今日利润
  getTodayProfitsTotal(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayProfitsTotal", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detail = that.data.detailData;
        detail.earn = res.result;
        that.setData({detailData: detail})
      }
    }, function(error) {})
  },
  // 今日充电电量
  getTodayQuantityTotal(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayQuantityTotal", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detail = that.data.detailData;
        detail.power = res.result;
        that.setData({detailData: detail})
      }
    }, function(error) {})
  },
  //获取详情
  refreshDevice(){
    let that = this;
    let deviceParams = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detail = that.data.detailData;
        detail.detail = res.result.chargingPileOrderDTO;
        that.setData({detailData: detail})
      }
    }, function(error) {})
  },
  //日充电量曲线
  getDailyChargingCurve(){
    let that = this;
    let deviceParams = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/chargingPile/getDailyChargingCurve", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var xData = new Array(res.result.length);
        var yData = new Array(res.result.length);
        for (let i = 0; i < res.result.length; i++) {
          if(res.result[i].collectTime != null){
            var date = res.result[i].collectTime.split('-');
            that.setData({yearAndMonth: date[0]+'-'+date[1]});
            xData[i] = parseInt(date[2]);
          }
          yData[i] = res.result[i].paramValue;
        }
        //绘制折线图
        var chart = that.selectComponent('#monthp-chart');
        that.drawChart(chart, xData, yData);
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getDeviceDataList();
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
          interval:1,
          textStyle: {
            fontSize: 12
          }
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