import * as util from "../../../utils/util"

Page({
  data: {
    fileListData: [],
    condtionDialogHeight: 0,
    scrollHeight: 0,
    scrollTop : 0,
    scrollTopPosition: 0,
    searchDataList:{},
    searchIndex: 0,
    // 文件格式
    typeList: {
      "type": 0,
      "selected": "0",
      "list": [{"id": "","name": "全部文件格式"}, {"id": "doc","name": "doc"}, {"id": "docx","name": "docx"}, {"id": "xls","name": "xls"}, {"id": "xlsx","name": "xlsx"}, {"id": "txt","name": "txt"}, {"id": "png","name": "png"}, {"id": "pdf","name": "pdf"}, {"id": "ppt","name": "ppt"}]
    },
    startTime: '',
    endTime: '',
    pageNumber: 1,
    pageNumberSize: 1,
    fileinfoName: ''
  },
  handleInput(res){
    this.setData({fileinfoName: res.detail.value, pageNumber: 1});
    this.pageFileInfo();
  },
  search(res){
    //选择框里面的数据
    var index = res.currentTarget.dataset.index;
    if(this.data.searchIndex == index && this.data.showSearchDialog){
      this.setData({
        showSearchDialog: false
      })
    }else{
      if(index==0){
        var searchDataList = this.data.typeList;
        this.setData({
          searchDataList: searchDataList,
          showSearchDialog: false
        })
      }
      //显示下拉单选框
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
      case 'single':
        // 单选
        if(e.detail.operate == "confirm") {
          if(this.data.searchIndex==0){
            this.setData({
              typeList: e.detail.data,
              pageNumber: 1
            })
            this.pageFileInfo();
          }
        }
        break;
    }
    //关闭选择框
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
    this.pageFileInfo();
  },
  // 分页查询文件信息
  pageFileInfo(){
    let that = this;
    let params = {
      createTimeStart: that.data.startTime,
      createTimeEnd: that.data.endTime,
      fileSuffix: that.data.typeList.list[that.data.typeList.selected].id,
      fileinfoName: that.data.fileinfoName,
      pageNumber: that.data.pageNumber,
      pageSize: 10,
      sortField: "",
      sortOrder: "",
    }
    util.wxRequestPost("/sps/app/operation/pageFileInfo", "加载中...", params, 'application/json', function(res) {
      console.log(res)
      if(res.data.success){
        var data = that.data.pageNumber==1?[]:that.data.fileListData;
        for (let i = 0; i < res.data.result.records.length; i++) {
          data.push(res.data.result.records[i]);
        }
        that.setData({fileListData: data, pageNumberSize: res.data.result.pages});
        var top = that.data.scrollTop;
        that.setData({
          scrollTopPosition : top
        });
      }
    }, function(error) {})
  },
  // 下载文件
  downloadFile(res){
    util.downloadFile("/sps/sys/common/static/"+res.currentTarget.dataset.item.fileValue, "加载中...", function(res) {
      console.log(res)
      wx.showToast({
        title: '下载完成，保存至' + res.savedFilePath
      });
    }, function(error) {})
  },
  //页面滑动到底部, 上拉刷新
  bindDownLoad:function(){
    if(this.data.pageNumber < this.data.pageNumberSize){
      var number = this.data.pageNumber + 1;
      this.setData({pageNumber: number});
      this.pageFileInfo();
    }
  },
  scroll:function(event){
    //该方法绑定了页面滚动时事件，当前的position.y的值
    this.setData({
      scrollTop : event.detail.scrollTop
    });
  },
  onLoad(options) {
    //设置dialog高度
    let rpxHeight = util.getScreenHeightRpx()-180;
    // 设置列表高度
    let rpxScrollHeight = util.getScreenHeightRpx()-168;
    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，月份要加1，因为从0开始计算
    const day = date.getDate(); // 获取当前日
    this.setData({
      condtionDialogHeight: rpxHeight,
      scrollHeight: rpxScrollHeight,
      startTime: util.formatTime((year-1)+'-'+month+'-'+day),
      endTime: util.formatTime(year+'-'+month+'-'+day)
    })
    
    this.pageFileInfo();
  },
  onReady() {

  }
})