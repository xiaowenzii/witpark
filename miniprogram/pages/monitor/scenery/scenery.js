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
          
           this.getData();
        }
      } else {
        // 左滑
        if(this.data.selectDeviceIndex != (this.data.deviceList.length-1)){
          let selected = this.data.selectDeviceIndex + 1;
          this.setData({selectDeviceIndex: selected});
          
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
          console.log('设备列表');
          console.log(res.data.result);
          
          that.getData();
        }
      }
    }, function(error) {})
  },
  //获取单个设备详情
  refreshDevice(){
    let that = this;
    let deviceParams = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({detailData: res.result.streetLightBasicInfoDTO});
        console.log('详情');
        console.log(res.result.streetLightBasicInfoDTO);
      }
    }, function(error) {})
  },
  getData(){
    this.refreshDevice();
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId, weatherInfo: wx.getStorageSync('weatherInfo')});
  },
  onReady() {
    this.getDeviceDataList();
  }
})