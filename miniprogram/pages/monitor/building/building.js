import * as util from "../../../utils/util";

Page({
  data: {
    todayDate: '',
    roomList: {
      "type": 1,
      "selected": 0,
      "list": []
    },
    dataList:[],
    powerMaxMinList: [], //电表最大最小功率
    electricList: [], //电表电量
    triphaseList: [], //电表三相数据
    tempList: [], //电表温度
    searchDataList:{},
    condtionDialogHeight: 0,
    showSearchDialog: false
  },
  search(res){
    //选择框里面的数据
    if(this.data.showSearchDialog){
      this.setData({
        showSearchDialog: false
      })
    } else {
      var searchDataList = this.data.roomList;
      this.setData({
        searchDataList: searchDataList,
        showSearchDialog: false
      })
      //下拉单选框
      this.setData({
        showSearchDialog: true
      })
    }
  },
  closeDialog: function(e) {
    switch (e.detail.type) {
      case 'multiple':
        // 多选
        break;
      case 'single':
        // 单选
        if(e.detail.operate == "confirm") {
          this.setData({
            roomList: e.detail.data
          })
          this.getPowerDeviceByBasicId();
        }
        break;
    }
    this.setData({
      showSearchDialog: false
    })
  },
   // 获取所有配电柜
   getPowerRoomBasicInfo(){
    let that = this;
    util.wxRequestGet("/sps/app/device/PowerRoom/getPowerRoomBasicInfo", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var roomArr = [];
        for (let i = 0; i < res.result.length; i++) {
          roomArr.push({id: res.result[i].powerroomBasicId, name: res.result[i].powerroomName});
          if(i==res.result.length-1){
            var list = that.data.roomList;
            list.list = roomArr;
            that.setData({roomList: list});

            //查询默认配电柜回路
            that.getPowerDeviceByBasicId();
          }
        }
      }
    }, function(error) {})
  },
  // 根据配电柜获取电表
  getPowerDeviceByBasicId(){
    let that = this;
    let params = {
      deviceBelonging: that.data.roomList.list[that.data.roomList.selected].id
    }
    util.wxRequestGet("/sps/app/device/PowerRoom/getPowerDeviceByBasicId", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      console.log(that.data.roomList.list[that.data.roomList.selected].name);
      console.log(res);
      if(res.success){
        that.setData({dataList: res.result});
        
        that.setData({powerMaxMinList: new Array(res.result.length)}); //固定详情数组长度
        for (let i = 0; i < res.result.length; i++) {
          that.getPowerRoomDevicePowerMaxMin(res.result[i].powerroomDeviceId, i);
        }
      }
    }, function(error) {})
  },
  // 根据电表和时间查最大功率和最小功率
  getPowerRoomDevicePowerMaxMin(powerroomDeviceId, index){
    let that = this;
    let params = {
      "meter": powerroomDeviceId,
      "room": "",
      "starTime": that.data.todayDate,
      "endTime": that.data.todayDate
    }
    util.wxRequestPost("/sps/app/device/PowerRoom/getPowerRoomDevicePowerMaxMin", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var powerMaxMinList = that.data.powerMaxMinList;
        powerMaxMinList[index] = res.data.result[0];
        that.setData({powerMaxMinList: powerMaxMinList});
        if(index == that.data.dataList.length-1){ //请求完成最大最小功率之后，再请求各电表电量
          console.log("功率")
          console.log(that.data.powerMaxMinList);

          that.setData({electricList: new Array(that.data.dataList.length)});//固定详情数组长度
          for (let i = 0; i < that.data.dataList.length; i++) {
            that.getPowerRoomDeviceElectric(that.data.dataList[i].powerroomDeviceId, i);
          }
        }
      }
    }, function(error) {})
  },
  // 根据电表和时间查询电量
  getPowerRoomDeviceElectric(powerroomDeviceId, index){
    let that = this;
    let params = {
      "meter": powerroomDeviceId,
      "room": "",
      "starTime": that.data.todayDate,
      "endTime": that.data.todayDate
    }
    util.wxRequestPost("/sps/app/device/PowerRoom/getPowerRoomDeviceElectric", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var electricList = that.data.electricList;
        electricList[index] = res.data.result[0];
        that.setData({electricList: electricList});
        if(index == that.data.dataList.length-1){ //请求各电表电量之后，再请求各电表三相电压数据
          console.log("电量")
          console.log(that.data.electricList);

          that.getElectricityMeterTemp(); //获取配电柜温度

          that.setData({triphaseList: new Array(that.data.dataList.length)});//固定详情数组长度
          for (let i = 0; i < that.data.dataList.length; i++) {
            that.getPowerDeviceResource(that.data.dataList[i].powerroomDeviceId, i);
          }
        }
      }
    }, function(error) {})
  },
  // 根据配电表获取最近的三相数据
  getPowerDeviceResource(powerroomDeviceId, index){
    let that = this;
    let params = {
      "deviceId": powerroomDeviceId
    }
    util.wxRequestGet("/sps/app/device/PowerRoom/getPowerDeviceResource", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var triphaseList = that.data.triphaseList;
        triphaseList[index] = res.result;
        that.setData({triphaseList: triphaseList});
        if(index == that.data.dataList.length-1){ //请求各电表三相电压数据完成
          console.log("三相")
          console.log(that.data.triphaseList);
        }
      }
    }, function(error) {})
  },
  // 根据配电表获取最近的三相数据
  getElectricityMeterTemp(){
    let that = this;
    let params = {
      "cabinetId": that.data.roomList.list[that.data.roomList.selected].id
    }
    util.wxRequestGet("/sps/app/device/PowerRoom/getElectricityMeterTemp", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      console.log("温度")
      console.log(res);
      if(res.success){
        that.setData({tempList: res.result});
      }
    }, function(error) {})
  },
  getTemp(){
    return 1;
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
    this.getPowerRoomBasicInfo();//获取配电柜
  }
})