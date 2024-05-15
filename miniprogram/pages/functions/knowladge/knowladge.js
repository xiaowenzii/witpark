import {getScreenHeightRpx, formatTime} from "../../../utils/util"

Page({
  data: {
    fileList: [{
      type: 'file',
      title: '运维知识库都是知识',
      size: '124',
      time: '2024-04-25 12:34:56',
      uploader: '管理员'
    }, {
      type: 'excel',
      title: 'excel 文件',
      size: '124',
      time: '2024-04-25 12:34:56',
      uploader: '管理员'
    }, {
      type: 'pdf',
      title: 'pdf 文件',
      size: '124',
      time: '2024-04-25 12:34:56',
      uploader: '管理员'
    }, {
      type: 'ppt',
      title: 'ppt 文件',
      size: '124',
      time: '2024-04-25 12:34:56',
      uploader: '管理员'
    }],
    condtionDialogHeight: 0,
    searchDataList:{},
    searchIndex: 0,
    // 文件格式
    typeList: {
      "type": 0,
      "selected": "0",
      "list": [{"id": "0","name": "全部格式"}, {"id": "1","name": "word"}, {"id": "2","name": "pdf"}]
    },
    startTime: '',
    endTime: ''
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
          showSearchDialog: false,
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
              typeList: e.detail.data
            })
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
      showSearchDialog: false
    })
  },
  onLoad(options) {
    //设置dialog高度
    let rpxHeight = getScreenHeightRpx()-180;
    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，月份要加1，因为从0开始计算
    const day = date.getDate(); // 获取当前日
    this.setData({
      condtionDialogHeight: rpxHeight,
      startTime: formatTime(year+'-'+month+'-'+day),
      endTime: formatTime(year+'-'+month+'-'+day)
    })
  },
  onReady() {

  }
})