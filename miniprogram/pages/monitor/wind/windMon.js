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
  getWeatherLatestData(){  //获取天气最新实时数据
    let that = this;
    let params = {
      deviceBasicId: '1778675876224094210'
    }
    util.wxRequestPost("/prod-api/one/device/gas/getLatestData", "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        let weatherData = res.data;
        if(weatherData.windDirection>348.75 || weatherData.windDirection<11.25){
          that.dataJs.weatherData.windDirectionLabel = '北风';
        }else if(weatherData.windDirection>11.25 && weatherData.windDirection<33.75){
          that.dataJs.weatherData.windDirectionLabel = '东北偏北风';
        }else if(weatherData.windDirection>33.75 && weatherData.windDirection<56.25){
          that.dataJs.weatherData.windDirectionLabel = '东北风';
        }else if(weatherData.windDirection>56.25 && weatherData.windDirection<78.75){
          that.dataJs.weatherData.windDirectionLabel = '东北偏东风';
        }else if(weatherData.windDirection>78.75 && weatherData.windDirection<101.25){
          that.dataJs.weatherData.windDirectionLabel = '东风';
        }else if(weatherData.windDirection>101.25 && weatherData.windDirection<123.75){
          that.dataJs.weatherData.windDirectionLabel = '东南偏东风';
        }else if(weatherData.windDirection>123.75 && weatherData.windDirection<146.25){
          that.dataJs.weatherData.windDirectionLabel = '东南风';
        }else if(weatherData.windDirection>146.25 && weatherData.windDirection<168.75){
          that.dataJs.weatherData.windDirectionLabel = '东南偏南风';
        }else if(weatherData.windDirection>168.75 && weatherData.windDirection<191.25){
          that.dataJs.weatherData.windDirectionLabel = '南风';
        }else if(weatherData.windDirection>191.25 && weatherData.windDirection<213.75){
          that.dataJs.weatherData.windDirectionLabel = '西南偏南风';
        }else if(weatherData.windDirection>213.75 && weatherData.windDirection<236.25){
          that.dataJs.weatherData.windDirectionLabel = '西南风';
        }else if(weatherData.windDirection>236.25 && weatherData.windDirection<258.75){
          that.dataJs.weatherData.windDirectionLabel = '西南偏西风';
        }else if(weatherData.windDirection>258.75 && weatherData.windDirection<281.25){
          that.dataJs.weatherData.windDirectionLabel = '西风';
        }else if(weatherData.windDirection>281.25 && weatherData.windDirection<303.75){
          that.dataJs.weatherData.windDirectionLabel = '西北偏西风';
        }else if(weatherData.windDirection>303.75 && weatherData.windDirection<326.25){
          that.dataJs.weatherData.windDirectionLabel = '西北风';
        }else if(weatherData.windDirection>326.25 && weatherData.windDirection<348.75){
          that.dataJs.weatherData.windDirectionLabel = '西北偏北风';
        }
        that.setData({weatherInfo: weatherData})
      }
    }, function(error) {})
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceCategoryId: that.data.deviceTypeId
    }
    util.wxRequestGet("/prod-api/business/device/list", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(res.rows != null && res.rows.length > 0){
          that.setData({deviceList: res.rows});
        }
      }
    }, function(error) {})
  },
  // 获得今日实时数据
  getWindPowerDataByDeviceId(){
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/prod-api/sps/wind/power/getRealTimeData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
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
        that.setData({powerData: res.result})
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
  },
  onReady() {
    this.getDeviceDataList();
  }
})