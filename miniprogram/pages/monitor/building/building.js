import * as util from "../../../utils/util";

Page({
  data: {
    todayDate: '',
    roomDataSelectedCode: '10090410',
    roomDataList: [{code: '10090410', roomName: '新大楼1楼-配电间'}, {code: '10090420', roomName: '新大楼顶楼-配电间'}, {code: '10090396', roomName: '老大楼1楼-配电间'}],
    fireDeviceData: {}, //配电房环境消防数据
    powerMeterList: [], //电表列表
    pMeter: {}, //选中的电表
    meterTransData: {},
    meterData: {},
    condtionDialogHeight: 0,
    showSearchDialog: false
  },
  selectRoom(res){
    let item = res.currentTarget.dataset.item;
    this.setData({
      roomDataSelectedCode: item.code
    })
    this.getRoomFireRealtimeData(); //根据设备编码获取消防实时数据
  },
  search(res){
    this.setData({
      showSearchDialog: !this.data.showSearchDialog
    })
  },
  closeDialog: function(e) {
    switch (e.detail.type) {
      case 'single':
        // 单选
        if(e.detail.operate == "confirm") {
          this.setData({
            roomList: e.detail.data
          })
          this.getElectricMeterTodayData(); //获取电表今日数据（电量，电费，碳排放）
          this.getElectricMeterRealtimeData(); //获取电表的最新实时数据
        }
        break;
    }
    this.setData({
      showSearchDialog: false
    })
  },
  getRoomFireRealtimeData(){ // 根据设备编码获取消防实时数据
    let that = this;
    let params = {
      deviceCode: that.data.roomDataSelectedCode
    };
    util.wxRequestGet("/prod-api/business/monitor/fire/realtime/data", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({
          fireDeviceData: res.data
        })
      }
    }, function(error) {})
  },
  getPowerDeviceByBasicId(){ // 根据配电房获取电表
    let that = this;
    let params = {
      deviceBelonging: ''
    }
    util.wxRequestGet("/prod-api/one/device/PowerRoom/getPowerDeviceByBasicId", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        let powerMeter = [];
        for(let i=0;i<res.data.length;i++){
          if(res.data[i].deviceType=='1'||res.data[i].deviceType=='9'){ //电表设备
            powerMeter.push(res.data[i]);
          }
        }
        that.setData({powerMeterList: powerMeter, pMeter: powerMeterList[0]});
        this.getElectricMeterTodayData(); //获取电表今日数据（电量，电费，碳排放）
        this.getElectricMeterRealtimeData(); //获取电表的最新实时数据
      }
    }, function(error) {})
  },
  getElectricMeterTodayData(){ //获取电表今日数据（电量，电费，碳排放）
    let that = this;
    let params = {
      deviceId: that.data.pMeter.powerroomDeviceId
    }
    util.wxRequestGet("/prod-api/one/device/electricMeter/getElectricMeterTodayData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({meterTransData: res.data});
      }
    }, function(error) {})
  },
  getElectricMeterRealtimeData(){ //获取电表的最新实时数据
    let that = this;
    let params = {
      deviceId: that.data.pMeter.powerroomDeviceId
    }
    util.wxRequestGet("/prod-api/one/device/electricMeter/getElectricMeterRealtimeData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({meterData: res.data});
      }
    }, function(error) {})
  },
  onLoad(options) {
    var rpxHeight = util.getScreenHeightRpx()-90;
    this.setData({
      condtionDialogHeight: rpxHeight
    })
  },
  onReady() {
     // 获取当前日期
     const date = new Date();
     this.setData({
       todayDate: date.getFullYear() + '-' + util.formatMD(date.getMonth() + 1) + '-' + util.formatMD(date.getDate())
     })
     this.getRoomFireRealtimeData(); //根据设备编码获取消防实时数据
     this.getPowerDeviceByBasicId(); //根据配电房获取电表
  }
})