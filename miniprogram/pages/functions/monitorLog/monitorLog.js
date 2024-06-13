import * as util from "../../../utils/util";

Page({
  data: {
    logList: []
  },
  listDeviceRunLog(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen1/listDeviceRunLog", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({logList: res.result})
      }
    }, function(error) {})
  },
  onLoad(options) {

  },
  onReady() {
    this.listDeviceRunLog();
  }
})