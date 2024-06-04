import * as util from "../../../utils/util"

Page({
  data: {
    weatherInfo: {},
    deviceTypeId: '',
    deviceList: [],
    selectDeviceIndex: 0,
    detailData: {},
    powerData: {},
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
          this.getWindPowerDataByDeviceId();
          this.getWindPowerTotal();
        }
      } else {
        // 左滑
        if(this.data.selectDeviceIndex != (this.data.deviceList.length-1)){
          let selected = this.data.selectDeviceIndex + 1;
          this.setData({selectDeviceIndex: selected});
          this.getWindPowerDataByDeviceId();
          this.getWindPowerTotal();
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
          console.log('设备列表');
          console.log(res.data.result);
          that.getWindPowerDataByDeviceId();
          that.getWindPowerTotal();
        }
      }
    }, function(error) {})
  },
  // 获取风力发电设备实时数据
  getWindPowerDataByDeviceId(){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/windPower/getWindPowerDataByDeviceId", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        console.log('获取风力发电设备实时数据');
        console.log(res.result);
        that.setData({detailData: res.result})
      }
    }, function(error) {})
  },
  // 获取总体发电情况
  getWindPowerTotal(){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/windPower/getWindPowerTotal", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        console.log('获取总体发电情况');
        console.log(res.result);
        that.setData({powerData: res.result})
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId, weatherInfo: wx.getStorageSync('weatherInfo')});
  },
  onReady() {
    this.getDeviceDataList();
  }
})