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
        deviceTypeId = this.getDeviceItem('空调').id;
        url =  '../../monitor/airCon/airCon?deviceTypeId='+ deviceTypeId
        break;
      case '2':
        //风力发电
        //deviceTypeId = this.getDeviceItem('风力发电').id;
        url =  '../../monitor/wind/windMon?deviceTypeId='+ deviceTypeId
        break;
      case '3':
        //光伏发电
        //deviceTypeId = this.getDeviceItem('屋顶光伏').id;
        url =  '../../monitor/photovoltaic/photovoltaic?deviceTypeId='+ deviceTypeId
        break;
      case '4':
        //储能监测
        //deviceTypeId = this.getDeviceItem('储能设备').id;
        url =  '../../monitor/EnergyStorage/EnergyStorage?deviceTypeId='+ deviceTypeId
        break;
      case '5':
        //充电桩监测
        //deviceTypeId = this.getDeviceItem('智能充电桩').id;
        url =  '../../monitor/chargingStation/chargingStation?deviceTypeId='+ deviceTypeId
        break;
      case '6':
        //空气源热泵
        //deviceTypeId = this.getDeviceItem('空气源热泵').id;
        url =  '../../monitor/heatPump/heatPump?deviceTypeId='+ deviceTypeId
        break;
      case '7':
        //风光储路灯监测
        //deviceTypeId = this.getDeviceItem('风光储路灯').id;
        url =  '../../monitor/scenery/scenery?deviceTypeId='+ deviceTypeId
        break;
      case '8':
        //光伏花监测
        //deviceTypeId = this.getDeviceItem('光伏花').id;
        url =  '../../monitor/photovoltaicFlower/photovoltaicFlower?deviceTypeId='+ deviceTypeId
        break;
      case '9':
        //地下照明监测
        //deviceTypeId = this.getDeviceItem('地下照明').id;
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
    util.wxRequestGet("/prod-api/business/deviceCategory/list", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({typeList: res.rows})
      }else{}
    }, function(error) {})
  },
  getDeviceItem(deviceNmae){ //获取设备类型
    let item = {};
    for (let index = 0; index < this.data.typeList.length; index++) {
      if(this.data.typeList[index].typeName == deviceNmae){
        item = this.data.typeList[index];
        break;
      }
    }
    return item;
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