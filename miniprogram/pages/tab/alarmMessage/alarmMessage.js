import {getScreenHeightRpx} from "../../../utils/util"

Page({
  data: {
    selecetStateIndex: 0,
    dataList: [
      {id: "0", title: "空调告警",level:"紧急",finish:"90%", limit:"1000", use:"900",owner:"张三", date:"2024-04", type:"电表", state:"未消除"},
      {id: "0", title: "照明设备告警", level:"一般",finish:"90%", limit:"1000", use:"900",owner:"张三", date:"2024-04", type:"电表", state:"已消除"}
    ],
    // 查询条件数据
    condtionDialogHeight: 0,
    searchDataList:{},
    // 设备状态
    deviceStateList: {
      "type": 0,
      "selected": "0",
      "list": [{"id": "0","name": "全部"}, {"id": "1","name": "停止"}, {"id": "2","name": "异常"}]
    },
    // 告警类型
    energyTypeList: {
      "type": 1,
      "selected": "0",
      "list": [{"id": "0","name": "全部"}, {"id": "1","name": "A告警"}, {"id": "2","name": "B告警"}]
    },
    showSearchDialog: false
  },
  selectState(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selecetStateIndex: index
    })
  },
  search(res){
    //选择框里面的数据
    var index = res.currentTarget.dataset.index;
    if(index==2){

    } else {
      var searchDataList = index==0?this.data.deviceStateList:this.data.energyTypeList;
      this.setData({
        searchDataList: searchDataList,
        showSearchDialog: false,
        searchIndex: index
      })
      //下拉单选框
      this.setData({
        showSearchDialog: true
      })
    }
  },
  abandan(res){
    console.log(res.currentTarget.dataset.item);
  },
  edit(res){
    console.log(res.currentTarget.dataset.item);
  },
  closeDialog: function(e) {
    switch (e.detail.type) {
      case 'multiple':
        // 多选
        if(e.detail.operate == "confirm") {
          this.setData({
            //searchDataList: e.detail.data
          })
        }
        break;
      case 'single':
        // 单选
        if(e.detail.operate == "confirm") {
          this.setData({
            searchDataList: e.detail.data
          })
          if(this.data.searchIndex==0){
            this.setData({
              deviceStateList: e.detail.data
            })
          }
          if(this.data.searchIndex== 1){
            this.setData({
              energyTypeList: e.detail.data
            })
          }
        }
        break;
    }
    
    this.setData({
      showSearchDialog: false
    })
  },
  
  onLoad: function (options) {
    let rpxHeight = getScreenHeightRpx()-240;
    this.setData({
      condtionDialogHeight: rpxHeight 
    })
  },
  onReady: function () {
  },
  onUnload: function () {
  }
})