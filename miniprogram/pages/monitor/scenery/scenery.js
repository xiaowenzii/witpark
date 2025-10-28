import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    realData: {}, //总数据
    deviceInfo: {}, //设备类型信息
    deviceList: [], //设备列表
    selectDeviceIndex: 0,
    deviceData: {} //单个设备数据
  },
  getDeviceCategoryList(){ //查询设备类别列表
    let that = this;
    let params = {};
    util.wxRequestPost("/prod-api/business/deviceCategory/list", "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        if(res.rows != null && res.rows.length > 0){
          for(let i=0;i<res.rows.length;i++){
						if(res.rows[i].typeName=='风光储路灯'){
              that.setData({deviceInfo: res.rows[i]});
              that.getDeviceList(); //查询风光储路灯设备列表
							break;
						}
					}
        }
      }
    }, function(error) {})
  },
  getDeviceList(){ //查询风光储路灯设备列表
    let that = this;
    let params = {
      deviceCategoryId: that.data.deviceInfo.id
    };
    util.wxRequestPost("/prod-api/business/device/list", "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        that.setData({deviceList: res.rows});
        that.selectTab(0); //路灯详情
      }
    }, function(error) {})
  },
  selectTab(tabIndex){ //路灯详情
    let that = this;
    let params = {
      deviceBasicId: that.data.deviceList[tabIndex].id
    };
    util.wxRequestGet("/prod-api/sps/storageStreetLightStatisticsData/energyStreetLightInfo", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({deviceData: res.data});
      }
    }, function(error) {})
  },
  monitorStatisticsData(){ //监测数据统计
    let that = this;
    let params = {
      deviceCategoryId: that.data.deviceInfo.id,
    };
    util.wxRequestGet("/prod-api/sps/storageStreetLightStatisticsData/monitorStatisticsData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({realData: res.data});
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
  },
  onReady() {
    this.getDeviceCategoryList(); //查询设备类别列表
    this.monitorStatisticsData(); //监测数据统计
  }
})