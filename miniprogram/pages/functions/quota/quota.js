import {getScreenHeightRpx} from "../../../utils/util"

Page({
  data: {
    selecetStateIndex: 0,
    searchIndex:0,
    dataList: [
      {id: "0", deviceName: "空调",type:"月计划",powerType:"用电", finish:"90%", limit:"1000", use:"900",makeOwner:"张三", useDate:"2024-04"},
      {id: "0", deviceName: "照明设备", type:"月计划",powerType:"用电", finish:"90%", limit:"1000", use:"900",makeOwner:"张三", useDate:"2024-04"}
    ],
    condtionDialogHeight: 0,
    searchDataList:{},
    // 计划类型
    planList: {
      "type": 0,
      "selected": "0",
      "list": [{"id": "0","name": "全部计划"}, {"id": "1","name": "年计划"}, {"id": "2","name": "月计划"}]
    },
    // 用能设备
    energyDeviceList: {
      "type": 1,
      "selected": "0",
      "list": [{"id": "0","name": "全部用能设备"}, {"id": "1","name": "风机"}, {"id": "2","name": "光伏"},{"id": "3","name": "空调"}, {"id": "4","name": "储能设备"}, {"id": "5","name": "充电桩"}, {"id": "6","name": "空气源热泵"}]
    },
    // 用能类型
    energyTypeList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "0","name": "全部用能类型"}, {"id": "1","name": "用电"}, {"id": "2","name": "发电"}]
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
    var searchDataList = index==0?this.data.planList:index==1?this.data.energyDeviceList:this.data.energyTypeList;
    this.setData({
      searchDataList: searchDataList,
      showSearchDialog: false,
      searchIndex: index
    })
    //下拉单选框
    this.setData({
      showSearchDialog: true
    })
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
              planList: e.detail.data
            })
          }
          if(this.data.searchIndex== 1){
            this.setData({
              energyDeviceList: e.detail.data
            })
          }
          if(this.data.searchIndex== 2){
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