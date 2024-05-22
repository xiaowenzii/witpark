import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceList: [],
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData:{},
    ec: {
      lazyLoad: true
    },
    startX: 0, // 触摸开始的X坐标
    endX: 0, // 触摸结束的X坐标
    threshold: 100 // 设置滑动多少距离后触发事件
  },
  touchStart: function(e) {
    this.data.startX = e.touches[0].clientX;
  },
  touchMove: function(e) {
    this.data.endX = e.touches[0].clientX;
  },
  touchEnd: function(e) {
    const deltaX = this.data.endX - this.data.startX;
    if (Math.abs(deltaX) > this.data.threshold) {
      if (deltaX > 0) {
        // 右滑
        if(this.data.selectDeviceIndex > 0){
          let selected = this.data.selectDeviceIndex - 1;
          this.setData({selectDeviceIndex: selected});
          
          this.getLatestData();
          this.getDailyPower();
        }
      } else {
        // 左滑
        if(this.data.selectDeviceIndex != (this.data.deviceList.length-1)){
          let selected = this.data.selectDeviceIndex + 1;
          this.setData({selectDeviceIndex: selected});
          
          this.getLatestData();
          this.getDailyPower();
        }
      }
    }
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestGet("/sps/app/device/listDevice", "加载中...", params, function(res) {
      if(res.success){
        if(res.result != null){
          that.setData({deviceList: res.result});
          if(res.result!=null && res.result.length > 0){
            that.getLatestData();
            that.getDailyPower();
          }
        }
      }
    }, function(error) {})
  },
  // 获取最新实时数据
  getLatestData(){
    let that = this;
    let deviceParams = {
      
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/solarPower/getLatestData", "加载中...", deviceParams, function(res) {
      if(res.success){
        if(res.result != null){
          console.log("获取最新实时数据")
          console.log(res);
          that.setData({detailData: res.result})
        }
      }
    }, function(error) {})
  },
  // 日发电量
  getDailyPower(interStr, url){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/solarPower/getDailyGeneratePower", "加载中...", params, function(res) {
      if(res.success){
        console.log("日发电量")
        console.log(res);
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getDeviceDataList();

    //绘制折线图
    var energyChart = this.selectComponent('#energy-power-chart');
    var xData = ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07", "04-08"];
    var yData = [85, 100, 34, 24, 46, 98, 80, 62];
    this.drawChart(energyChart, xData, yData)
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