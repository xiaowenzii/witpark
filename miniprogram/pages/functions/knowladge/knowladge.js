import {getScreenHeightRpx} from "../../../utils/util"

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
    // 文件大小
    sizeList: {
      "type": 1,
      "selected": "0",
      "list": [{"id": "0","name": "全部"}, {"id": "1","name": "0-100K"}, {"id": "2","name": "100-400K"}]
    }
  },
  search(res){
    //选择框里面的数据
    var index = res.currentTarget.dataset.index;
    if(index==2){

    } else {
      var searchDataList = index==0?this.data.typeList:this.data.sizeList;
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
          if(this.data.searchIndex== 1){
            this.setData({
              sizeList: e.detail.data
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
  onClose(){
    this.setData({
      showSearchDialog: false
    })
  },
  async onConfirm(event) {
    let date = new Date(event.detail)
    let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    let dateInt = date.getTime()
    console.log('dateString = ' + dateString + ', dateInt = ' + dateInt)

    this.setData({
      showSearchDialog: false
    })
  },
  onLoad(options) {
    let rpxHeight = getScreenHeightRpx()-180;
    this.setData({
      condtionDialogHeight: rpxHeight
    })
  },
  onReady() {

  }
})