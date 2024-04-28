// pages/functions/quota/quota.js
Page({
  data: {
    selecetStateIndex: 0,
    dataList: [
      {id: "0", title: "空调告警",level:"紧急",finish:"90%", limit:"1000", use:"900",owner:"张三", date:"2024-04", type:"电表", state:"未消除"},
      {id: "0", title: "照明设备告警", level:"一般",finish:"90%", limit:"1000", use:"900",owner:"张三", date:"2024-04", type:"电表", state:"已消除"}
    ],
    // 查询条件数据
    searchDataList: {
      "selected": [{
          "type": "0",
          "selectedId": "0"
        }, {
          "type": "1",
          "selectedId": "2"
        },
        {
          "type": "2",
          "selectedId": "1"
        }, {
          "type": "3",
          "selectedId": "2"
        }
      ],
      "dataList": [{
        "type": "0",
        "desc": "计划类型",
        "list": [{
          "id": "0",
          "name": "全部"
        }, {
          "id": "1",
          "name": "年计划"
        }, {
          "id": "2",
          "name": "月计划"
        }]
      }, {
        "type": "1",
        "desc": "用能设备",
        "list": [{
            "id": "0",
            "name": "全部"
          }, {
            "id": "1",
            "name": "风机"
          }, {
            "id": "2",
            "name": "光伏"
          },
          {
            "id": "3",
            "name": "空调"
          }, {
            "id": "4",
            "name": "储能设备"
          }, {
            "id": "5",
            "name": "充电桩"
          }, {
            "id": "6",
            "name": "空气源热泵"
          }
        ]
      }, {
        "type": "2",
        "desc": "用能类型",
        "list": [{
          "id": "0",
          "name": "全部"
        }, {
          "id": "1",
          "name": "用电"
        }, {
          "id": "2",
          "name": "发电"
        }]
      }, {
        "type": "3",
        "desc": "状态",
        "list": [{
          "id": "0",
          "name": "全部"
        }, {
          "id": "1",
          "name": "已发布"
        }, {
          "id": "2",
          "name": "未发布"
        }, {
          "id": "3",
          "name": "已作废"
        }]
      }]
    },
    showSearchDialog: false
  },
  selectState(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selecetStateIndex: index
    })
  },
  search(){
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
    if(e.detail.operate == "1") {
      this.setData({
        searchDataList: e.detail.data
      })
    }
    this.setData({
      showSearchDialog: false
    })
  },
  
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onUnload: function () {
  }
})