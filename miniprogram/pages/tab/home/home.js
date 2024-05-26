import * as util from "../../../utils/util";

Page({
  data: {
    typeList:[]
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, function(res) {
      if(res.success){
        that.setData({typeList: res.result})
        console.log(res);
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.getDeviceType();
  }
})