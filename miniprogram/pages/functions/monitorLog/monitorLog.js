import * as util from "../../../utils/util";

Page({
  data: {
    deviceTypeList: [],
    deviceId: '',
    startDate: '',
    endDate: '',
    importLevelList: [{id: '0', name: '一般'}, {id: '1', name: '严重'}, {id: '2', name: '非常严重'}],
    importLevel: '0',
    warringDataList: []
  },
  selectImportLevel(e){ //选择严重级别
    this.setData({importLevel: e.currentTarget.dataset.item.id});
    this.getTableData(); //查询设备告警记录列表
  },
  bindStartDateChange: function(e) { //选择时间
    if (e.detail.value > this.data.endDate) {
      this.showErrorMessage('开始时间不能晚于结束时间');
      return;
    }
    this.setData({
      startDate: e.detail.value
    });
    that.getTableData(); //查询设备告警记录列表
  },
  bindEndDateChange: function(e) { //选择时间
    if (this.data.startDate > e.detail.value) {
      this.showErrorMessage('开始时间不能晚于结束时间');
      return;
    }
    this.setData({
      endDate: e.detail.value
    });
    that.getTableData(); //查询设备告警记录列表
  },
  deviceCategoryList(){ //查询设备类别列表
    let that = this;
    util.wxRequestGet("/prod-api/business/deviceCategory/list", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        let dList = [];
        dList.push({id: '0', typeName: '全部设备'});
        for(let i=0;i<res.rows.length;i++){
          dList.push(res.rows[i]);
        }
        that.setData({deviceTypeList: dList, deviceId: dList[0].id});
        that.getTableData(); //查询设备告警记录列表
      }
    }, function(error) {})
  },
  getTableData(){ //查询设备告警记录列表
    let that = this;
    let params = {
      startDate: startDate + ' 00:00:00',
      endDate: endDate + ' 23:59:59',
      deviceCategoryId: that.data.deviceId=='0'?'':that.data.deviceId,
      severity: that.data.importLevel=='0'?'':that.data.searchImportLevel,  //严重程度(1:一般 2:严重 3:非常严重)
      pageSize: 1,
      pageNum: 500,
      orderByColumn: '',
      isAsc: 'desc'  //排序的方向desc或者asc
    }
    util.wxRequestGet("/prod-api/business/deviceCategory/list", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({warringDataList: res.data});
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({ 
      startDate: util.formatDate(util.getPreviousDate(1)), 
      endDate: util.formatDate(util.getPreviousDate(0)) 
    });
  },
  onReady() {
    this.deviceCategoryList(); //查询设备类别列表
  }
})