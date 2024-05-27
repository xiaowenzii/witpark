import * as util from "../../../utils/util"

Page({
  data: {
    deviceList: [],
    selectDeviceIndex: 0,
    deviceTypeId: '',
    detailData: {},
    dailyChargingPowerData: {},
    dailyDisChargingPowerData: {},
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
           this.getLatestData();
           this.getDailyPower('getDailyChargingPower', '/sps/app/device/solarTree/getDailyChargingPower');
           this.getDailyPower('getDailyDisChargingPower', '/sps/app/device/solarTree/getDailyDisChargingPower');
           this.getDailyPower('getDailyGeneratePower', '/sps/app/device/solarTree/getDailyGeneratePower');
        }
      } else {
        // 左滑
        if(this.data.selectDeviceIndex != (this.data.deviceList.length-1)){
          let selected = this.data.selectDeviceIndex + 1;
          this.setData({selectDeviceIndex: selected});
           // 获取详情和今日发电
           this.getLatestData();
           this.getDailyPower('getDailyChargingPower', '/sps/app/device/solarTree/getDailyChargingPower');
           this.getDailyPower('getDailyDisChargingPower', '/sps/app/device/solarTree/getDailyDisChargingPower');
           this.getDailyPower('getDailyGeneratePower', '/sps/app/device/solarTree/getDailyGeneratePower');
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
        if(res.result != null){
          that.setData({deviceList: res.result});
          if(res.result!=null && res.result.length > 0){
            // 获取详情和今日发电
            that.getLatestData();
            that.getDailyPower('getDailyChargingPower', '/sps/app/device/solarTree/getDailyChargingPower');
            that.getDailyPower('getDailyDisChargingPower', '/sps/app/device/solarTree/getDailyDisChargingPower');
            that.getDailyPower('getDailyGeneratePower', '/sps/app/device/solarTree/getDailyGeneratePower');
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
    util.wxRequestGet("/sps/app/device/solarTree/getLatestData", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(res.result != null){
          console.log("获取最新实时数据")
          console.log(res);
          that.setData({detailData: res.result})
        }
      }
    }, function(error) {})
  },
  // 日放电量, 日充电量, 日发电量
  getDailyPower(interStr, url){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet(url, "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(interStr == 'getDailyChargingPower'){
          console.log("日充电量: ")
          console.log(res)
          that.setData({dailyChargingPowerData: res.result})
        }else if(interStr == 'getDailyDisChargingPower'){
          console.log("日放电量: ")
          console.log(res)
          that.setData({dailyDisChargingPowerData: res.result})
        }else if(interStr == 'getDailyGeneratePower'){
          console.log("日发电量: ")
          console.log(res)
          that.setData({dailyGeneratePowerData: res.result})
        }
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