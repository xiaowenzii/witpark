import * as util from "../../../utils/util"

Page({
  data: {
    alarmDataList:[{
      device:"1号路灯",
      time:"2024-05-09 15:30",
      desc:"设备出现异常"
    }, {
      device:"2号路灯",
      time:"2024-05-09 15:30",
      desc:"设备出现异常"
    }, {
      device:"3号路灯",
      time:"2024-05-09 15:30",
      desc:"设备出现异常"
    }]
  },
  // 设备总功率
  getAllDevicePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getAllDevicePowerTotal", "加载中...", {}, function(res) {
      console.log("设备总功率: ")
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  // 总用电量
  getAllUsePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getAllUsePowerTotal", "加载中...", {}, function(res) {
      console.log("总用电量: ")
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  // 当月用电量
  getCurrentMonthlyUsePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getCurrentMonthlyUsePowerTotal", "加载中...", {}, function(res) {
      console.log("当月用电量: ")
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  // 日用电量曲线
  getDailyUsePowerCurve(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getDailyUsePowerCurve", "加载中...", {}, function(res) {
      console.log("日用电量曲线: ")
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  // 月用电量曲线
  getMonthlyUsePower(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getMonthlyUsePower", "加载中...", {}, function(res) {
      console.log("月用电量曲线: ")
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  // 今日用电量
  getTodayUsePowerTotal(){
    let that = this;
    util.wxRequestGet("/sps/app/device/undergroundLighting/getTodayUsePowerTotal", "加载中...", {}, function(res) {
      console.log("今日用电量: ")
      console.log(res)
      if(res.success){

      }
    }, function(error) {})
  },
  onLoad(options) {
    this.getAllDevicePowerTotal();
    this.getAllUsePowerTotal();
    this.getCurrentMonthlyUsePowerTotal();
    this.getDailyUsePowerCurve();
    this.getMonthlyUsePower();
    this.getTodayUsePowerTotal();
  },
  onReady() {

  }
})