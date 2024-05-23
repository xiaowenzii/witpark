Page({
  data: {
    userInfo: {}
  },
  logout(){
    wx.reLaunch({
      url: '../../../pages/index/index',
    })
  },
  onLoad(options) {
    this.setData({userInfo: wx.getStorageSync('userInfo')});
  },
  onReady() {

  }
})