Page({
  data: {

  },
  goFunction(res){
    switch (res.currentTarget.dataset.item) {
      case '0':
        //建筑环境
        wx.navigateTo({
          url: '../../monitor/building/building'
        })
        break;
      case '1':
        //空调控制单元
        wx.navigateTo({
          url: '../../monitor/airCon/airCon'
        })
        break;
      case '2':
        //风力发电
        wx.navigateTo({
          url: '../../monitor/wind/windMon'
        })
        break;
      case '3':
        //光伏发电
        wx.navigateTo({
          url: '../../monitor/photovoltaic/photovoltaic'
        })
        break;
      case '4':
        //储能监测
        wx.navigateTo({
          url: '../../monitor/EnergyStorage/EnergyStorage'
        })
        break;
      case '5':
        //充电桩监测
        wx.navigateTo({
          url: '../../monitor/chargingStation/chargingStation'
        })
        break;
      case '6':
        //空气源热泵
        wx.navigateTo({
          url: '../../monitor/heatPump/heatPump'
        })
        break;
      case '7':
        //风光储路灯监测
        wx.navigateTo({
          url: '../../monitor/scenery/scenery'
        })
        break;
      case '8':
        //光伏花监测
        wx.navigateTo({
          url: '../../monitor/photovoltaicFlower/photovoltaicFlower'
        })
        break;
      case '9':
        //地下照明监测
        wx.navigateTo({
          url: '../../monitor/underLight/underLight'
        })
        break;
    }
  },
  onLoad(options) {

  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  }
})