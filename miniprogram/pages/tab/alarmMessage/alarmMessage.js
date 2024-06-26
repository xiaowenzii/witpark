import * as util from "../../../utils/util"

Page({
  data: {
    alarmProcessedStatus: 0,
    dataList: [],
    // 查询条件数据
    condtionDialogHeight: 0,
    scrollHeight: 0,
    scrollTop : 0,
    scrollTopPosition: 0,
    searchDataList:{},
    searchIndex: 0,
    // 告警级别
    alarmLevel: {
      "type": 0,
      "selected": "0",
      "list": [{"id": "","name": "全部（告警级别）"}, {"id": "0","name": "紧急（告警级别）"}, {"id": "1","name": "重要（告警级别）"}, {"id": "2","name": "一般（告警级别）"}]
    },
    showSearchDialog: false,
    startTime: '',
    endTime: '',
    pageNumber: 1,
    pageNumberSize: 1,
    deviceName: ''
  },
  handleInput(res){
    this.setData({deviceName: res.detail.value, pageNumber: 1});
    this.pageAlarmBasic();
  },
  selectState(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      alarmProcessedStatus: index
    })
    this.pageAlarmBasic();
  },
  search(res){
    //选择框里面的数据
    var index = res.currentTarget.dataset.index;
    if(this.data.searchIndex == index && this.data.showSearchDialog){
      this.setData({
        showSearchDialog: false
      })
    } else {
      if(index==0){
        var searchDataList = this.data.alarmLevel;
        this.setData({
          searchDataList: searchDataList,
          showSearchDialog: false
        })
      }
      //下拉单选框
      this.setData({
        showSearchDialog: true,
        searchIndex: index
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
          if(this.data.searchIndex==0){
            this.setData({
              alarmLevel: e.detail.data,
              pageNumber: 1
            })
            this.pageAlarmBasic();
          }
        }
        break;
    }
    this.setData({
      showSearchDialog: false
    })
  },
  closeDateDialog: function(e){
    //关闭选择框
    this.setData({
      startTime: e.detail.startTime,
      endTime: e.detail.endTime,
      showSearchDialog: false,
      pageNumber:1
    })
    this.pageAlarmBasic();
  },
  // 分页查询文件信息
  pageAlarmBasic(){
    let that = this;
    let params = {
      alarmProcessedStatus: that.data.alarmProcessedStatus,
      alarmLevel: that.data.alarmLevel.list[that.data.alarmLevel.selected].id,
      createTimeStart: that.data.startTime,
      createTimeEnd: that.data.endTime,
      pageNumber: that.data.pageNumber,
      pageSize: 10,
      deviceName: that.data.deviceName,
      planYearMonth: "",
      quotaPlanType: "1",
      sortField: "",
      sortOrder: ""
    }
    console.log(params);
    util.wxRequestPost("/sps/app/alarm/pageAlarmBasic", "加载中...", params, function(res) {
      console.log(res)
      if(res.data.success){
        var data = that.data.pageNumber==1?[]:that.data.dataList;
        for (let i = 0; i < res.data.result.records.length; i++) {
          data.push(res.data.result.records[i]);
        }
        that.setData({dataList: data, pageNumberSize: res.data.result.pages});
        var top = that.data.scrollTop;
        that.setData({
          scrollTopPosition : top
        });
      }
    }, function(error) {})
  },
  //页面滑动到底部, 上拉刷新
  bindDownLoad:function(){
    if(this.data.pageNumber < this.data.pageNumberSize){
      var number = this.data.pageNumber + 1;
      this.setData({pageNumber: number});
      this.pageAlarmBasic();
    }
  },
  scroll:function(event){
    //该方法绑定了页面滚动时事件，当前的position.y的值
    this.setData({
      scrollTop : event.detail.scrollTop
    });
  },
  onLoad: function (options) {
    let rpxHeight = util.getScreenHeightRpx()-240;
    // 设置列表高度
    let rpxScrollHeight = util.getScreenHeightRpx()-240;
    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，月份要加1，因为从0开始计算
    const day = date.getDate(); // 获取当前日
    this.setData({
      condtionDialogHeight: rpxHeight,
      scrollHeight: rpxScrollHeight,
      startTime: util.formatTime(year+'-'+month+'-'+day),
      endTime: util.formatTime(year+'-'+month+'-'+day)
    })

    this.pageAlarmBasic();
  },
  onReady: function () {
  },
  onUnload: function () {
  }
})