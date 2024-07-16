import * as util from "../../../utils/util"

Page({
  data: {
    scrollHeight: 0,
    scrollTop : 0,
    scrollTopPosition: 0,
    pageNumber: 1,
    pageNumberSize: 1,
    responseManageTitle: '',
    dataList: []
  },
  handleInput(res){
    this.setData({responseManageTitle: res.detail.value, pageNumber: 1, scrollTop : 0});
    this.pageResponseManage();
  },
  // 分页查询文件信息
  pageResponseManage(){
    let that = this;
    let params = {
      responseBeginTime: '',
      responseManageTitle: that.data.responseManageTitle,
      pageNumber: that.data.pageNumber,
      pageSize: 10,
      sortField: "",
      sortOrder: "",
    }
    util.wxRequestPost("/sps/app/demandResponse/pageResponseManage", "加载中...", params, 'application/json', function(res) {
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
      this.pageResponseManage();
    }
  },
  scroll:function(event){
    //该方法绑定了页面滚动时事件，当前的position.y的值
    this.setData({
      scrollTop : event.detail.scrollTop
    });
  },
  onLoad(options) {
    // 设置列表高度
    let rpxScrollHeight = util.getScreenHeightRpx()-90;
    this.setData({
      scrollHeight: rpxScrollHeight
    })
  },
  onReady() {
    this.pageResponseManage();
  },
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})