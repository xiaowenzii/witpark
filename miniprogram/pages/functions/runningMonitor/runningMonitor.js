import * as util from "../../../utils/util"; 

Page({
  data: {
    typeList:[]
  },
  goFunction(res){
    let deviceTypeId = '';
    let url = '';
    switch (res.currentTarget.dataset.item) {
      case '0':
        //建筑环境
        url = '../../monitor/building/building?deviceTypeId='+ deviceTypeId
        break;
      case '1':
        //空调控制单元
        deviceTypeId = this.data.typeList[0].deviceTypeId;
        url =  '../../monitor/airCon/airCon?deviceTypeId='+ deviceTypeId
        break;
      case '2':
        //风力发电
        deviceTypeId = this.data.typeList[3].deviceTypeId;
        url =  '../../monitor/wind/windMon?deviceTypeId='+ deviceTypeId
        break;
      case '3':
        //光伏发电
        deviceTypeId = this.data.typeList[6].deviceTypeId;
        url =  '../../monitor/photovoltaic/photovoltaic?deviceTypeId='+ deviceTypeId
        break;
      case '4':
        //储能监测
        deviceTypeId = this.data.typeList[7].deviceTypeId;
        url =  '../../monitor/EnergyStorage/EnergyStorage?deviceTypeId='+ deviceTypeId
        break;
      case '5':
        //充电桩监测
        deviceTypeId = this.data.typeList[4].deviceTypeId;
        url =  '../../monitor/chargingStation/chargingStation?deviceTypeId='+ deviceTypeId
        break;
      case '6':
        //空气源热泵
        deviceTypeId = this.data.typeList[5].deviceTypeId;
        url =  '../../monitor/heatPump/heatPump?deviceTypeId='+ deviceTypeId
        break;
      case '7':
        //风光储路灯监测
        deviceTypeId = this.data.typeList[1].deviceTypeId;
        url =  '../../monitor/scenery/scenery?deviceTypeId='+ deviceTypeId
        break;
      case '8':
        //光伏花监测
        deviceTypeId = this.data.typeList[2].deviceTypeId;
        url =  '../../monitor/photovoltaicFlower/photovoltaicFlower?deviceTypeId='+ deviceTypeId
        break;
      case '9':
        //地下照明监测
        deviceTypeId = this.data.typeList[9].deviceTypeId;
        url = '../../monitor/underLight/underLight?deviceTypeId='+ deviceTypeId
        break;
    }
    wx.navigateTo({
      url: url
    })
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({typeList: res.result})
      }else{}
    }, function(error) {})
  },
  onLoad(options) {
  },

  onReady() {
    this.getDeviceType()
  },

  onShow() {

  },

  onHide() {

  }
})