import * as util from "../../../utils/util"

Page({
  data: {
    deviceList: [],
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData:{},
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
          
          this.getChargingStatus();
          this.getTodayDifftimeTotal();
          this.getTodayOrderCount();
          this.getTodayProfitsTotal();
          this.getTodayQuantityTotal();
        }
      } else {
        // 左滑
        if(this.data.selectDeviceIndex != (this.data.deviceList.length-1)){
          let selected = this.data.selectDeviceIndex + 1;
          this.setData({selectDeviceIndex: selected});
          
          this.getChargingStatus();
          this.getTodayDifftimeTotal();
          this.getTodayOrderCount();
          this.getTodayProfitsTotal();
          this.getTodayQuantityTotal();
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
    util.wxRequestGet("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.success){
        console.log("设备列表:");
        console.log(res);
        if(res.result != null){
          that.setData({deviceList: res.result});
          if(res.result!=null && res.result.length > 0){
            that.getChargingStatus();
            that.getTodayDifftimeTotal();
            that.getTodayOrderCount();
            that.getTodayProfitsTotal();
            that.getTodayQuantityTotal();
          }
        }
      }else{}
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
      console.log("充电桩工作状态");
      console.log(res)
      if(res.success){

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
      console.log("今日充电时长");
      console.log(res)
      if(res.success){

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
      console.log("今日充电次数");
      console.log(res)
      if(res.success){

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
      console.log("今日利润");
      console.log(res)
      if(res.success){

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
      console.log("今日充电电量");
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getDeviceDataList();
  },
  onReady() {

  }
})