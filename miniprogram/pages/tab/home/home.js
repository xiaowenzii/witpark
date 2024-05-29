import * as util from "../../../utils/util";

Page({
  data: {
    airStationType: '',
    airStationBasicId: '',
    weatherInfo:{}
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(res.result != null && res.result.length>0){
          for (var i = 0; i < res.result.length; i++) {
            if(res.result[i].deviceTypeName == "小型气象站"){
              that.setData({airStationType: res.result[i].deviceTypeId});
              that.getDeviceDataList();
            }
          }
        }
      }
    }, function() {})
  },
  // 获取单个设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: this.data.airStationType
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        that.setData({airStationBasicId: res.data.result[0].deviceBasicId});
        that.getLatestData();
      }
    }, function(error) {})
  },
  // 获取气象站最新实时数据
  getLatestData(){
    let that = this;
    let params = {
      deviceTypeId: that.data.airStationType,
      deviceBasicId: that.data.airStationBasicId
    }
    util.wxRequestPost("/sps/app/device/gas/getLatestData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      console.log(res);
      if(res.data.success){
        that.setData({weatherInfo: res.data.result});
        wx.setStorageSync('weatherInfo', res.data.result);
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.getDeviceType();
  }
})