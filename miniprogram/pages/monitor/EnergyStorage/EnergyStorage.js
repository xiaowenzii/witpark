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
      token: wx.getStorageSync('token'),
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestGet("/sps/app/device/listDevice", "加载中...", params, function(res) {
      if(res.success){
        console.log("设备列表:");
        console.log(res);
        if(res.result != null){
          that.setData({deviceList: res.result});
          if(res.result!=null && res.result.length > 0){
            that.getLatestData();
            that.getpCurve();
          }
        }
      }else{
        console.log(res);
      }
    }, function(error) {})
  },
  // 获取最新实时数据
  getLatestData(){
    let that = this;
    let params = {
      token: wx.getStorageSync('token'),
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/storeEnergy/getLatestData", "加载中...", params, function(res) {
      console.log("获取最新实时数据");
      console.log(res);
      if(res.success){

      }
    }, function(error) {})
  },
  // 有功功率曲线
  getpCurve(){
    let that = this;
    let params = {
      token: wx.getStorageSync('token'),
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/storeEnergy/getpCurve", "加载中...", params, function(res) {
      console.log("有功功率曲线");
      console.log(res);
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