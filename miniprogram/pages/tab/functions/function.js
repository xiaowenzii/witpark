Page({
  /**
   * 页面的初始数据
   */
  data: {
    functionModules: [{
      icon: '../../../asset/quota.png', 
      text: '定额管理', 
      url: '../../functions/quota/quota'
    }, {
      icon: '../../../asset/reponse.png', 
      text: '需求响应', 
      url: '../../functions/demandResponse/response'
    }, {
      icon: '../../../asset/energy_anysis.png', 
      text: '能耗分析', 
      url: '../../functions/energyConsumptionAnalysis/energyAnalysis'
    }, {
      icon: '../../../asset/knowladge.png', 
      text: '运维知识库', 
      url: '../../functions/knowladge/knowladge'
    }, {
      icon: '../../../asset/knowladge.png', 
      text: '运行日志', 
      url: '../../functions/monitorLog/monitorLog'
    }]
  },
  goRunningDataOverview(){
    // 运行数据总览
    wx.navigateTo({
      url: '../../functions/runningDataOverview/overview'
    })
  },
  goEnergyOverview(){
    // 能耗总览
    wx.navigateTo({
      url: '../../functions/energyOverview/energyOverview'
    })
  },
  goRunningMonitor(){
    // 运行检测
    wx.navigateTo({
      url: '../../functions/runningMonitor/runningMonitor'
    })
  },
  goDevicesMonitor() {
    // 设备监控
    wx.navigateTo({
      url: '../../functions/devices/device'
    })
  },
  goFunction(data){
    // 其它功能模块
    wx.navigateTo({
      url: data.currentTarget.dataset.item.url
    })
  },

  onLoad(options) {

  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  onPullDownRefresh() {

  },

  onReachBottom() {

  },

  onShareAppMessage() {

  }
})