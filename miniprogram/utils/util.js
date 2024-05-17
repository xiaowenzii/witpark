const baseUrl = "https://anywords.cn";
// const baseUrl = "https://a1510edec-wxc27d4cff09888171.sh.wxcloudrun.com";

// POST请求
export const wxRequestPost = (url, title, parmas, successCallback, failCallback) => {
  const requestUrl = baseUrl + url;
  wx.showLoading({
      title: title,
      mask: true
  });
  wx.request({
    url: requestUrl, 
    header: {'content-type': 'application/json'},
    method: 'POST',
    data: parmas,
    success: function(res) {
      wx.hideLoading();
      successCallback(res);
    },
    fail: function(error) {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: (error.data && error.data.message) || "请求失败"
      });
      if (failCallback) {
        failCallback(error);
      }
    }
  });
}
// GET请求
export const wxRequestGet = (url, title, parmas, successCallback, failCallback) => {
  const requestUrl = baseUrl + url;
  wx.showLoading({
      title: title,
      mask: true
  });
  wx.request({
    url: requestUrl,
    header: {'content-type': 'application/json'},
    method: 'GET',
    data: parmas,
    success: function(res) {
      wx.hideLoading();
      successCallback(res.data);
    },
    fail: function(error) {
      wx.hideLoading();
      wx.showToast({
        icon: "none",
        title: (error.data && error.data.message) || "请求失败"
      });
      if (failCallback) {
        failCallback(error);
      }
    }
  });
}

// 获取设备图标
export const deviceIcon = (parmas) => {
  var type = parmas.type;
  var icon = '';
  switch (type) {
    case '0': //空调
      icon = 'build/kt_k.png'
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
      icon = 'build/kt_k.png'
      break;
    case '5':
      icon = 'build/kt_k.png'
      break;
    case '6':
      icon = 'build/kt_k.png'
      break;
    case '7':
      icon = 'build/kt_k.png'
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

export const getPixelRatio = () => {
  let pixelRatio = 0
  wx.getSystemInfo({
    success: function (res) {
      pixelRatio = res.pixelRatio
    },
    fail: function () {
      pixelRatio = 0
    }
  })
  return pixelRatio
}

// 时间格式2024-5-6 => 2024-05-06
export const formatTime = (time) => {
  let dateSpl = time.split("-");
  let finTime = dateSpl[0] + "-" + (parseInt(dateSpl[1])>9?dateSpl[1]:('0'+dateSpl[1])) + "-" + (parseInt(dateSpl[2])>9?dateSpl[2]:('0'+dateSpl[2]));

  return finTime;
}