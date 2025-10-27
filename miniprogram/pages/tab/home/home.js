import * as util from "../../../utils/util"

Page({
  data: {
    userInfo: {},
    weatherInfo:{},
    todayDate: '',
    yEarn: 0,
    mEarn:0,
    allEarn: 0,
    ec: {
      lazyLoad: true
    },
    totalPowerData: {},
    elecCarbonEmission: {},
    elecCarbonReduction: {}
  },
  // 获取气象站最新实时数据
  getLatestData(){
    let that = this;
    let params = {
      deviceBasicId: '1778675876224094210'
    }
    util.wxRequestPost("/prod-api/one/device/gas/getLatestData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        let weatherData = {};
        if(res.data==null){
          weatherData = { illumination: '', temperature: '', humidity: '', windSpeed: '' };
        }else{
          weatherData = res.data;
        }
        that.setData({weatherInfo: weatherData});
        wx.setStorageSync('weatherInfo', weatherData);
      }
    }, function(error) {})
  },
  // 用能数据统计 包含：用电、发电、节电数据及同期对比 时间类型：today-今日, month-当月, year-当年, total-累计
  getCarbonEmissionsOverviewVO(type){
    let that = this;
    util.wxRequestGet("/prod-api/business/energyVisualization/energyStatistics", "加载中...", {timeType: type}, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(type=='day'){
          that.setData({elecCarbonEmission: res.data});
        }else if(type=='total'){
          that.setData({totalPowerData: res.data});
        }
      }
    }, function(error) {})
  },
  // 碳数据统计 包含：碳排量、碳减量、节约标准煤、等效植树、碳中和比等数据 时间类型：today-今日, month-当月, year-当年, total-累计
  getCarbonReductionOverview(){
    let that = this;
    util.wxRequestGet("/prod-api/business/energyVisualization/carbonStatistics", "加载中...", {timeType: 'day'}, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({elecCarbonReduction: res.data});
      }
    }, function(error) {})
  },
  // 获取年收益、月收益、总收益
  getEarningsRanking(type){
    let that = this;
    var params ={type: type};
    util.wxRequestGet("/prod-api/business/energyVisualization/economicBenefits", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(type=='month'){
          that.setData({mEarn: (parseFloat(res.data.totalRevenue)/10000).toFixed(3)});
        }else if(type=='year'){
          that.setData({yEarn: (parseFloat(res.data.totalRevenue)/10000).toFixed(3)});
        }else if(type=='total'){
          that.setData({allEarn: (parseFloat(res.data.totalRevenue)/10000).toFixed(3)});
        }
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
    this.getLatestData();  // 获取气象站最新实时数据
    this.getCarbonEmissionsOverviewVO('day'); // 用能数据统计
    this.getCarbonEmissionsOverviewVO('total');
    this.getCarbonReductionOverview(); // 碳数据统计
    this.getEarningsRanking('month'); // 获取年收益、月收益、总收益
    this.getEarningsRanking('year');
    this.getEarningsRanking('total');
  }
})