import * as util from "../../../utils/util";

Page({
  data: {
    userInfo: {},
    airStationType: '',
    airStationBasicId: '',
    weatherInfo:{},
    todayDate: '',
    yEarn: 0,
    mEarn:0,
    allEarn: 0,
    allUsepower: 0,
    allCreatePower: 0
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
      if(res.data.success){
        that.setData({weatherInfo: res.data.result});
        wx.setStorageSync('weatherInfo', res.data.result);
      }
    }, function(error) {})
  },
  // 获取年收益、月收益、总收益
  getEarningsRanking(type){
    let that = this;
    var params ={type: type};
    util.wxRequestGet("/sps/bigscreen1/getEarningsRanking", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(type=='m'){
          that.setData({mEarn:res.result.totalMoney});
        }else if(type=='y'){
          that.setData({yEarn:res.result.totalMoney});
        }else{
          that.setData({allEarn:res.result.totalMoney});
        }
      }
    }, function(error) {})
  },
  // 获取总发电量
  getGenerationStatistics(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen3/getGenerationStatistics", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var power = 0;
        for (let i = 0; i < res.result.powerOverviewVoList.length; i++) {
          power = power+parseFloat(res.result.powerOverviewVoList[i].totalValue);
          if(i==res.result.powerOverviewVoList.length-1){
            that.setData({allCreatePower: power});
          }
        }
      }
    }, function(error) {})
  },
  // 获取总用电量
  getComprehensivePowerMiddle(){
    let that = this;
    util.wxRequestGet("/sps/PowerAnalysis/getComprehensivePowerMiddle", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({allUsepower: res.result.packSumPower});
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({userInfo: wx.getStorageSync('userInfo')});
  },
  onReady(){
    // 获取当前日期
    const date = new Date();
    this.setData({
      todayDate: date.getFullYear() + '.' + util.formatMD(date.getMonth() + 1) + '.' + util.formatMD(date.getDate())
    })
    this.getDeviceType();
    this.getEarningsRanking('m');
    this.getEarningsRanking('y');
    this.getEarningsRanking('');
    this.getGenerationStatistics();
    this.getComprehensivePowerMiddle();
  }
})