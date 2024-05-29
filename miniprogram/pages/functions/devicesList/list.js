import * as util from "../../../utils/util";

Page({
  data: {
    scrollWidth: '100%',
    selected: 0,
    typeList: [],
    deviceList: []
  },
  selecteDevice(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selected: index
    })
    this.getDeviceDataList();
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let item = this.data.typeList[this.data.selected];
    let params = {
      deviceTypeId: item.deviceTypeId
    }
    console.log(params);
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null){
          let dataList = res.data.result;
          // 获取单个设备的详情
          for (let index = 0; index < dataList.length; index++) {
            let deviceParams = {
              deviceTypeId: item.deviceTypeId,
              deviceBasicId: dataList[index].deviceBasicId
            }
            util.wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
              if(res.success){
                if(res.result != null){
                  dataList[index].detail = res.result;
                }
              }
            }, function(error) {})
          }
          that.setData({deviceList: dataList});
          console.log('设备列表');
          console.log(dataList);
        }
      }else{
        that.setData({deviceList: []});
      }
    }, function(error) {})
  },
  onLoad(options) {
    // 获取传过来的参数
    const params = JSON.parse(options.params);
    this.setData({
      selected: params.selected,
      typeList: params.typeList
    })

    wx.getSystemInfo({
      success: (res)  => {
        var scrollWidth = res.windowWidth * (750 / res.windowWidth) - 48;
        this.setData({
          scrollWidth: scrollWidth+"rpx"
        })
      },fail: console.error,
    });

    this.getDeviceDataList();
  },
  onReady() {
  }
})