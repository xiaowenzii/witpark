Component({
  properties: {
    searchData: Object,
    type: String
  },
  data: {
    searchDataList: {},
    selectType: "multiple",
    itemChecked: 0
  },
  methods: {
    // 多选点击选择
    multipleSelect(res){
      var item = res.currentTarget.dataset.item;
      var innerItem = res.currentTarget.dataset.inneritem;
      var searchData = this.data.searchDataList;
      for(var i=0; i<searchData.selected.length; i++){
        if(searchData.selected[i].type == item.type){
          searchData.selected[i].selectedId = innerItem.id;
          this.setData({
            searchDataList: searchData
          })
        }
      }
    },
    // 单选点击选择
    singleSelect(res){
      var index = res.currentTarget.dataset.index;
      var dataList = this.data.searchDataList;
      dataList.selected = index;
      this.setData({
        itemChecked: index,
        searchDataList: dataList
      })
    },
    // 点击确认或者取消
    close(res){
      var operate = res.currentTarget.dataset.operate;
      var msg = {
        operate: operate, 
        type: this.data.selectType,
        data: this.data.searchDataList
      }
      var myEventOption = {}
      this.triggerEvent('myevent', msg, myEventOption);
    }
  },

  attached: function() {
    // 初始化查询类型及数据
    this.setData({
      searchDataList: this.properties.searchData,
      selectType: this.properties.type,
      itemChecked:this.properties.searchData.selected
    })
  }
})