Page({
  data: {
    scrollWidth: '100%',
    selected: 0,
    deviceList:[
      {
        id: '1',
        desc: '13-1-1001-13',
        address: '旧楼1#号楼 1层',
        state: 0
      },{
        id: '2',
        desc: '13-1-1001-13',
        address: '旧楼1#号楼 1层',
        state: 1
      },{
        id: '2',
        desc: '13-1-1001-13',
        address: '旧楼1#号楼 1层',
        state: 1
      },{
        id: '2',
        desc: '13-1-1001-13',
        address: '旧楼1#号楼 1层',
        state: 0
      },{
        id: '2',
        desc: '13-1-1001-13',
        address: '旧楼1#号楼 1层',
        state: 1
      }
    ]
  },
  selecteDevice(res){
    var index = res.currentTarget.dataset.index
    this.setData({
      selected: index
    })
  },
  switchState(res){
    console.log(res.currentTarget.dataset.item);
  },
  onShow() {
    wx.getSystemInfo({
      success: (res)  => {
        var scrollWidth = res.windowWidth * (750 / res.windowWidth) - 48;
        this.setData({
          scrollWidth: scrollWidth+"rpx"
        })
      },fail: console.error,
    });
  }
})