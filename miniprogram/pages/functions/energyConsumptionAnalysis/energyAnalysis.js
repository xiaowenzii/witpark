import {deviceIcon} from "../../../utils/util"; 

Page({
  data: {
    selected: 0,
    deviceList: [
      {
        type: '0',
        icon: '',
        desc: '空调',
        yd: '234',
        ydgl: '2200'
      }, {
        type: '1',
        icon: '',
        desc: '空气源热泵',
        yd: '234',
        ydgl: '2200'
      }, {
        type: '2',
        icon: '',
        desc: '充电桩',
        yd: '234',
        ydgl: '2200'
      }, {
        type: '3',
        icon: '',
        desc: '发电单元',
        yd: '234',
        ydgl: '2200'
      }
    ]
  },
  selectType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selected: index
    })
  },
  getDeviceIcon(){
    var deviceList = this.data.deviceList;
    for (let index = 0; index < deviceList.length; index++) {
      deviceList[index].icon = '../../../asset/' + deviceIcon({type: deviceList[index].type});
    }
    this.setData({
      deviceList: deviceList
    })
  },
  onLoad(options) {
    this.getDeviceIcon();
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