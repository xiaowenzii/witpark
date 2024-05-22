import * as util from "../../../utils/util"

Page({
  data: {
    deviceList: [],
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData:{}
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestGet("/sps/app/device/listDevice", "加载中...", params, function(res) {
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
    util.wxRequestGet("/sps/app/device/chargingPile/getChargingStatus", "加载中...", params, function(res) {
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
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayDifftimeTotal", "加载中...", params, function(res) {
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
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayOrderCount", "加载中...", params, function(res) {
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
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayProfitsTotal", "加载中...", params, function(res) {
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
    util.wxRequestGet("/sps/app/device/chargingPile/getTodayQuantityTotal", "加载中...", params, function(res) {
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