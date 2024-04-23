Component({
  properties: {
    searchData: Object
  },
  data: {
    searchDataList: {}
  },
  methods: {
    // 选择条件
    selectCondtion(e){
      var item = e.currentTarget.dataset.item;
      var innerItem = e.currentTarget.dataset.inneritem;
      var searchDataList = this.data.searchDataList;
      for(var i=0; i<searchDataList.selected.length; i++){
        if(searchDataList.selected[i].type == item.type){
          searchDataList.selected[i].selectedId = innerItem.id;
          this.setData({
            searchDataList: searchDataList
          })
        }
      }
    },
    // 点击确认或者取消
    confirm(){
      var msg = {
        operate: "1", 
        data: this.data.searchDataList
      }
      var myEventOption = {}
      this.triggerEvent('myevent', msg, myEventOption);
    },
    cancel(){
      var msg = {
        operate: "0", 
        data: this.data.searchDataList
      }
      var myEventOption = {}
      this.triggerEvent('myevent', msg, myEventOption);
    }
  },

  attached: function() {
    // 初始化查询列表
    this.setData({
      searchDataList: this.properties.searchData
    })
  }
})