import * as util from "../../../utils/util"

Page({
  data: {
    weatherInfo: {},
    deviceList: [],
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData: {},
    monthEarn: 0,
    yearEarn: 0,
    dailyGeneratePowerData: {},
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
           // 获取详情和今日发电
           this.getData();
        }
      } else {
        // 左滑
        if(this.data.selectDeviceIndex != (this.data.deviceList.length-1)){
          let selected = this.data.selectDeviceIndex + 1;
          this.setData({selectDeviceIndex: selected});
           // 获取详情和今日发电
           this.getData();
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
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null && res.data.result.length > 0){
          that.setData({deviceList: res.data.result});
          // 获取详情和今日发电
          that.getData();
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
    util.wxRequestGet("/sps/app/device/solarTree/getLatestData", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(res.result != null){
          that.setData({detailData: res.result})
        }
      }
    }, function(error) {})
  },
  // 日发电量, 月发电量, 年发电量
  getDailyPower(interStr, url){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet(url, "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(interStr == 'getDailyGeneratePower'){
          that.setData({dailyGeneratePowerData: res.result})
        } else if(interStr == 'getMonthlyMoney'){
          that.setData({monthEarn: res.result})
        } else if(interStr == 'getYearlyMoney'){
          that.setData({yearEarn: res.result})
        }
      }
    }, function(error) {})
  },
  getData(){
    this.getLatestData();
    this.getDailyPower('getDailyGeneratePower', '/sps/app/device/solarTree/getDailyGeneratePower');
    this.getDailyPower('getMonthlyMoney', '/sps/app/device/solarTree/getMonthlyMoney');
    this.getDailyPower('getYearlyMoney', '/sps/app/device/solarTree/getYearlyMoney');
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId, weatherInfo: wx.getStorageSync('weatherInfo')});
  },
  onReady() {
    this.getDeviceDataList();
  }
})