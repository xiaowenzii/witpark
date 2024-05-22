const baseUrl = "https://anywords.cn";

// POST请求
export const wxRequestPost = (url, title, parmas, successCallback, failCallback) => {
  const requestUrl = baseUrl + url;
  var XTenantId = '';
  var token = '';
  if(wx.getStorageSync('userInfo').loginTenantId != null){
    XTenantId = wx.getStorageSync('userInfo').loginTenantId;
  }
  if(wx.getStorageSync('token') != null){
    token = wx.getStorageSync('token');
  }
  wx.showLoading({
      title: title,
      mask: true
  });
  wx.request({
    url: requestUrl, 
    header: {'content-type': 'application/json', 'X-Tenant-Id': XTenantId, 'X-Access-Token': token},
    method: 'POST',
    data: parmas,
    success: function(res) {
      wx.hideLoading();
      successCallback(res);
    },
    fail: function(error) {
      wx.hideLoading();
      wx.showToast({
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
  var requestUrl = baseUrl + url;
  var XTenantId = '';
  var token = '';
  if(wx.getStorageSync('userInfo').loginTenantId != null){
    XTenantId = wx.getStorageSync('userInfo').loginTenantId;
  }
  if(wx.getStorageSync('token') != null){
    token = wx.getStorageSync('token');
  }
  wx.showLoading({
      title: title,
      mask: true
  });
  wx.request({
    url: requestUrl,
    header: {'content-type': 'application/json', 'X-Tenant-Id': XTenantId, 'X-Access-Token': token},
    method: 'GET',
    data: parmas,
    success: function(res) {
      wx.hideLoading();
      successCallback(res.data);
    },
    fail: function(error) {
      wx.hideLoading();
      wx.showToast({
        title: (error.data && error.data.message) || "请求失败"
      });
      if (failCallback) {
        failCallback(error);
      }
    }
  });
}

//文件下载
export const downloadFile = (url, title, successCallback, failCallback) => {
  var requestUrl = baseUrl + url;
  wx.showLoading({
      title: title,
      mask: true
  });
  wx.downloadFile({
    url: requestUrl,
    success: function(res) {
      wx.hideLoading();
      wx.getFileSystemManager().saveFile({
        tempFilePath: res.tempFilePath,
        success: function (saveRes) {
          successCallback(saveRes);
        },
        fail: function (err) {}
      })
    },
    fail: function(error) {
      wx.hideLoading();
      wx.showToast({
        title: (error.data && error.data.message) || "下载失败，请重新下载"
      });
      if (failCallback) {
        failCallback(error);
      }
    }
  });
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

// 月份和日数补充至两位
export const formatMD = (dateNum) => {
  if(parseInt(dateNum)>9){
    return parseInt(dateNum);
  }else{
    return '0' + parseInt(dateNum);
  }
}