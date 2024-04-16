Page({
  data: {

  },
  onLoad(options) {

  },

})
//Tab 组件
Component({
  data: {
    "color": "#BFBFBF",
    "selectedColor": "#1296BD",
    selected: 0,
    "list": [{
      "pagePath": "../../tab/home/home",
      "text": "首页",
      "iconPath": "../../../asset/home.png",
      "selectedIconPath": "../../../asset/home_selected.png"
    }, {
        "pagePath": "../../tab/alarmMessage/alarmMessage",
        "text": "告警",
        "iconPath": "../../../asset/alarm.png",
        "selectedIconPath": "../../../asset/alarm_selected.png"
    }, {
      "pagePath": "../../tab/person/person",
      "text": "我的",
      "iconPath": "../../../asset/person.png",
      "selectedIconPath": "../../../asset/person_selected.png"
    }]
  },
  attached() {
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({  
        selected: 0
      })
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})