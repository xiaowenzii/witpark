import * as util from "../../../utils/util"

Page({
  data: {
    searchIndex:0,
    dataList: [],
    quotaPlanType: 1,
    pageNumber: 1,
    pageNumberSize: 1,
    condtionDialogHeight: 0,
    scrollHeight: 0,
    scrollTop : 0,
    scrollTopPosition: 0,
    searchDataList:{},
    // 年份选择
    yearList: {
      "type": 0,
      "selected": 0,
      "list": [{"id": "2023","name": "2023（年）"}, {"id": "2024","name": "2024（年）"}, {"id": "2025","name": "2025（年）"}, {"id": "2026","name": "2026（年）"}]
    },
    // 月份选择
    monthList: {
      "type": 1,
      "selected": 0,
      "list": [{"id": "1","name": "全部（月）"}, {"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "3","name": "3 月"}, {"id": "4","name": "4 月"}, {"id": "5","name": "5 月"}, {"id": "6","name": "6 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}]
    },
    // 用能设备
    typeList: {
      "type": 2,
      "selected": 0,
      "list": []
    },
    showSearchDialog: false
  },
  search(res){
    //选择框里面的数据
    var index = res.currentTarget.dataset.index;
    if(this.data.searchIndex == index && this.data.showSearchDialog){
      this.setData({
        showSearchDialog: false
      })
    } else {
      var searchDataList = index==0?this.data.yearList:index==1?this.data.monthList:this.data.typeList;
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
        break;
      case 'single':
        // 单选
        if(e.detail.operate == "confirm") {
          this.setData({
            searchDataList: e.detail.data
          })
          if(this.data.searchIndex==0){
            this.setData({
              yearList: e.detail.data
            })
          }
          if(this.data.searchIndex== 1){
            // 月份选择，如果选择全部，则定义为年计划
            var planType = this.data.quotaPlanType;
            if(e.detail.data.selected == 0){
              planType = 0;
            } else {
              planType = 1;
            }
            this.setData({
              monthList: e.detail.data,
              quotaPlanType: planType
            })
          }
          // 选择设备类型
          if(this.data.searchIndex== 2){
            this.setData({
              typeList: e.detail.data
            })
          }

          this.pageQuotaPlant();
        }
        break;
    }
    this.setData({
      showSearchDialog: false
    })
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, 'application/json', function(res) {
      if(res.success){
        var list = [];
        list.push({id:'', name:'全部（设备）'});
        for (let i = 0; i < res.result.length; i++) {
          var item = {
            id: res.result[i].deviceTypeId,
            name: res.result[i].deviceTypeName
          }
          list.push(item);
        }
        var typeList = that.data.typeList;
        typeList.list = list;
        that.setData({typeList: typeList});

        that.pageQuotaPlant();
      }
    }, function(error) {})
  },
  // 定额计划分页查询
  pageQuotaPlant(){
    let that = this;
    let params = {
      deviceTypeId: that.data.typeList.list[that.data.typeList.selected].id,
      pageNumber: 1,
      planYearMonth: that.data.yearList.list[that.data.yearList.selected].id + '-'+ that.data.monthList.list[that.data.monthList.selected].id + '-01 00:00',
      quotaPlanType: that.data.quotaPlanType, //年计划或者月计划: 0 年计划；1 月计划
      pageSize: 10,
      sortField: "",
      sortOrder: ""
    }
    util.wxRequestPost("/sps/app/quotaPlan/pageQuotaPlant", "加载中...", params, 'application/json', function(res) {
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

      this.pageQuotaPlant();
    }
  },
  scroll:function(event){
    //该方法绑定了页面滚动时事件，当前的position.y的值
    this.setData({
      scrollTop : event.detail.scrollTop
    });
  },
  onLoad: function (options) {
    var rpxHeight = util.getScreenHeightRpx()-90;
    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，月份要加1，因为从0开始计算
    var yearArr = this.data.yearList;
    var monthArr = this.data.monthList;
    for (let i = 0; i < yearArr.list.length; i++) {
      if(year == yearArr.list[i].id){
        yearArr.selected = i;
      }
    }
    for (let j = 0; j < monthArr.list.length; j++) {
      if(month == monthArr.list[j].id){
        monthArr.selected = j;
      }
    }
    this.setData({
      condtionDialogHeight: rpxHeight,
      scrollHeight: rpxHeight,
      yearList: yearArr,
      monthList: monthArr
    })

    this.getDeviceType();
  },
  onReady: function () {

  },
  onUnload: function () {
  }
})