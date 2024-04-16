const app = getApp() // 获取全局APP对象
let that = null // 页面this指针变量
Page({
  data: { // 默认数据
  },
  /**
   * 页面装载回调
   */
  onLoad () {
    that = this // 设置页面this指针到全局that
    
  }
})
