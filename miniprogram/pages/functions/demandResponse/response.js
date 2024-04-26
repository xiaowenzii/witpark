Page({
  data: {
    selecetStateIndex: 0,
    dataList: [
      {
        id:'0',
        desc: '电网邀约信息',
        text1: '120',
        text2: '2024-04-25 09:39:12',
        text3: '0小时',
        text4: '2024-04-25 09:39:12',
        text5: '0.9'
      }, {
        id:'1',
        desc: '电网邀约信息',
        text1: '120',
        text2: '2024-04-25 09:39:12',
        text3: '1小时',
        text4: '2024-04-25 09:39:12',
        text5: '0.9'
      }, {
        id:'2',
        desc: '电网邀约信息',
        text1: '120',
        text2: '2024-04-25 09:39:12',
        text3: '2小时',
        text4: '2024-04-25 09:39:12',
        text5: '0.9'
      }, {
        id:'3',
        desc: '电网邀约信息',
        text1: '120',
        text2: '2024-04-25 09:39:12',
        text3: '3小时',
        text4: '2024-04-25 09:39:12',
        text5: '0.9'
      }
    ]
  },
  selectState(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selecetStateIndex: index
    })
  },
  refuse(res){
    console.log(res.currentTarget.dataset.item);
  },
  reponse(res){
    console.log(res.currentTarget.dataset.item);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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