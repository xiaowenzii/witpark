// 同时发送异步代码的次数
let ajaxTimes = 0;
export const wxRequest = (parmas) => {
  // 当有地方调用请求方法的时候，就增加全局变量，用于判断有几个请求了
  ajaxTimes++;
  // 显示加载中loading效果
  wx.showLoading({
      title: "加载中",
      mask: true
  });
  
  let myHeader = { ...parmas.header };
  if (parmas.url.includes("/neddToken/")) {
      myHeader["Authorization"] = wx.getStorageSync("token");
  }
  const baseUrl = "http://59.52.10.182:8880"
  return new Promise((resolve, reject) => {
    wx.request({
      ...parmas,
      // 注意，此行必须放在   ...parmas 之下，才能覆盖其传入的url:xxx参数
      url: baseUrl + parmas.url,
      header: { 'content-type': 'application/json', ...myHeader },
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      // 不管请求成功还是失败，都会触发
      complete: () => {
        ajaxTimes--;
        // 关闭loading效果了
        if (ajaxTimes === 0) {
            wx.hideLoading();
        }
      }
    });
  })
}

// 获取设备图标
export const deviceIcon = (parmas) => {
  var type = parmas.type;
  var icon = '';
  switch (type) {
    case '0': //空调
      icon = 'kt.png'
      break;
    case '1': //空气源热泵
      icon = 'kqyrb.png'
      break;
    case '2': //充电桩
      icon = 'cdz.png'
      break;
    case '3': //发电单元
      icon = 'fddy.png'
      break;
    case '4':
      icon = 'kt.png'
      break;
    case '5':
      icon = 'kt.png'
      break;
    case '6':
      icon = 'kt.png'
      break;
    case '7':
      icon = 'kt.png'
      break;
  }
  return icon;
}

// 获取屏幕高度
export const getScreenHeightRpx = () => {
  let rpxHeight = 750;
  wx.getSystemInfo({
    success: (result) => {
      let hiehgt=result.windowHeight
      let width=result.windowWidth;
      // px转rpx的转换比例
      rpxHeight=750/width*hiehgt;//750为设计稿的宽度
    },
    fail: (res) => {},
    complete: (res) => {},
  })
  return rpxHeight;
}