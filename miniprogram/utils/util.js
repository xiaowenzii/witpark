// const baseUrl = "https://www.zhnycloud.cn:16060";
const baseUrl = "https://anywords.cn";

// POST请求
export const wxRequestPost = (url, title, parmas, contentType, successCallback, failCallback) => {
  const requestUrl = baseUrl + url;
  var XTenantId = '';
  var token = '';
  if(wx.getStorageSync('userInfo').loginTenantId != null){
    XTenantId = wx.getStorageSync('userInfo').loginTenantId;
  }
  if(wx.getStorageSync('token') != null){
    token = wx.getStorageSync('token');
  }
  wx.request({
    url: requestUrl, 
    header: {'content-type': contentType, 'X-Tenant-Id': XTenantId, 'X-Access-Token': token},
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
export const wxRequestGet = (url, title, parmas, contentType, successCallback, failCallback) => {
  var requestUrl = baseUrl + url;
  var XTenantId = '';
  var token = '';
  if(wx.getStorageSync('userInfo').loginTenantId != null){
    XTenantId = wx.getStorageSync('userInfo').loginTenantId;
  }
  if(wx.getStorageSync('token') != null){
    token = wx.getStorageSync('token');
  }
  wx.request({
    url: requestUrl,
    header: {'content-type': contentType, 'X-Tenant-Id': XTenantId, 'X-Access-Token': token},
    method: 'GET',
    data: parmas,
    success: function(res) {
      wx.hideLoading();
      successCallback(res.data);
    },
    fail: function(error) {
      console.log(error);
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

// PUT请求
export const wxRequestPut = (url, title, parmas, contentType, successCallback, failCallback) => {
  const requestUrl = baseUrl + url;
  var XTenantId = '';
  var token = '';
  if(wx.getStorageSync('userInfo').loginTenantId != null){
    XTenantId = wx.getStorageSync('userInfo').loginTenantId;
  }
  if(wx.getStorageSync('token') != null){
    token = wx.getStorageSync('token');
  }
  wx.request({
    url: requestUrl, 
    header: {'content-type': contentType, 'X-Tenant-Id': XTenantId, 'X-Access-Token': token},
    method: 'PUT',
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

//文件下载
export const downloadFile = (url, title, successCallback, failCallback) => {
  var requestUrl = baseUrl + url;
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

export const getPreviousDate = (days) => {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date;
}
export const formatDate = (date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
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

// 时间戳转化为具体时间
export const toDate = (number) => {
  if(number!=null && number !=''){
    var date = new Date(number);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
  }else{
    return '';
  }
}

//绘制柱状图和折线图
export const drawMixEChart = (echarts, chart, xData, yData, interval) => {
	let option = {};
	let series = [];
	for(let j=0; j<yData.length; j++){
		if(yData[j].type == 'bar'){
			// 绘制柱状图
			for (let i = 0; i < yData[j].data.length; i++) {
				series.push({
					name: yData[j].titles[i],
					type: 'bar',
					label: {
						show: true, position: 'top', formatter: (value, index) => { return value?.value; }
					},
					itemStyle: {
						borderWidth: 1,
						color: {
							type: 'linear',
								x: 0,  // 水平方向起始点（0=左）
								y: 0,  // 垂直方向起始点（0=上）
								x2: 0, // 水平方向终点（0=左）
								y2: 1, // 垂直方向终点（1=下）
								colorStops: [
								{ offset: 0, color: yData[j].colors[i] },      // 顶部颜色
								{ offset: 1, color: yData[j].colors[i]+'33' }  // 底部颜色
							]
						},
						borderRadius: [12, 12, 12, 12] //柱状图radius
					},
					label: {
						show: false, //柱状图顶部是否显示数值
						position: 'top',
						formatter: function(params) { if (params.value == 0) { return ''; } else { return params.value; } }
					},
					data: yData[j].data[i]
				})
			}
		} else if(yData[j].type == 'line'){
			for (let i = 0; i < yData[j].data.length; i++) {
				series.push({
					name: yData[j].titles[i],
					data: yData[j].data[i],
					type: "line",
					smooth: true,
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, // 渐变方向 (0,0)到(0,1)表示垂直向下
					        [
								{ offset: 0, color: yData[j].colors[i]+'99' }, // 起始颜色
								{ offset: 1, color: yData[j].colors[i]+'00' }  // 结束颜色
							]
						)
					},
					symbol: 'circle',    //将小圆点改成实心 不写symbol默认空心
					symbolSize: 3,       //小圆点的大小
					itemStyle: {color: yData[j].colors[i]},
					lineStyle: {width: 2,color: yData[j].colors[i]}
				})
			}
		}
	}
	option = {
		xAxis: {
			type: 'category',
			axisLabel: {
				interval: function (index, value) {
					// 总是显示第一个和最后一个标签
					if (index == 0 || index == xData.length-1) {
						return true;
					}
					return index%interval == 0;
				},
				color: '#4E5969' ,
			},
			axisTick: {
				show: true, inside: true, length: 0,     
				lineStyle: { color: '#4E5969', width: 1, type: 'dashed' }
			},
			data: xData
		},
		yAxis: { type: 'value', axisLabel: { color: '#4E5969' }},
		tooltip: { trigger: "axis" },
		legend: { data: yData.titles },
		series: series,
		grid: { x: 48, x2: 24, y: 18, y2: 24 } //左右上下
	};
	chart.setOption(option, true);
}

// 设置月份
export const monthList = (dateNum) => {
  var monthList = [];
  switch (dateNum) {
    case 1:
      monthList = [{"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "3","name": "3 月"}, {"id": "4","name": "4 月"}, {"id": "5","name": "5 月"}, {"id": "6","name": "6 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 2:
      monthList = [{"id": "2","name": "2 月"}, {"id": "1","name": "1 月"}, {"id": "3","name": "3 月"}, {"id": "4","name": "4 月"}, {"id": "5","name": "5 月"}, {"id": "6","name": "6 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 3:
      monthList = [{"id": "3","name": "3 月"}, {"id": "2","name": "2 月"}, {"id": "1","name": "1 月"}, {"id": "4","name": "4 月"}, {"id": "5","name": "5 月"}, {"id": "6","name": "6 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 4:
      monthList = [{"id": "4","name": "4 月"}, {"id": "3","name": "3 月"}, {"id": "2","name": "2 月"}, {"id": "1","name": "1 月"}, {"id": "5","name": "5 月"}, {"id": "6","name": "6 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 5:
      monthList = [{"id": "5","name": "5 月"}, {"id": "4","name": "4 月"}, {"id": "3","name": "3 月"}, {"id": "2","name": "2 月"}, {"id": "1","name": "1 月"}, {"id": "6","name": "6 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 6:
      monthList = [{"id": "6","name": "6 月"}, {"id": "5","name": "5 月"}, {"id": "4","name": "4 月"}, {"id": "3","name": "3 月"}, {"id": "2","name": "2 月"}, {"id": "1","name": "1 月"}, {"id": "7","name": "7 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 7:
      monthList = [{"id": "7","name": "7 月"}, {"id": "6","name": "6 月"}, {"id": "5","name": "5 月"}, {"id": "4","name": "4 月"}, {"id": "3","name": "3 月"}, {"id": "2","name": "2 月"}, {"id": "1","name": "1 月"}, {"id": "8","name": "8 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 8:
      monthList = [{"id": "8","name": "8 月"}, {"id": "7","name": "7 月"}, {"id": "6","name": "6 月"}, {"id": "5","name": "5 月"}, {"id": "4","name": "4 月"}, {"id": "3","name": "3 月"}, {"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "9","name": "9 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 9:
      monthList = [{"id": "9","name": "9 月"}, {"id": "8","name": "8 月"}, {"id": "7","name": "7 月"}, {"id": "6","name": "6 月"}, {"id": "5","name": "5 月"}, {"id": "4","name": "4 月"}, {"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "3","name": "3 月"}, {"id": "10","name": "10 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 10:
      monthList = [{"id": "10","name": "10 月"}, {"id": "9","name": "9 月"}, {"id": "8","name": "8 月"}, {"id": "7","name": "7 月"}, {"id": "6","name": "6 月"}, {"id": "5","name": "5 月"}, {"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "3","name": "3 月"}, {"id": "4","name": "4 月"}, {"id": "11","name": "11 月"}, {"id": "12","name": "12 月"}];
      break;
    case 11:
      monthList = [{"id": "11","name": "11 月"}, {"id": "10","name": "10 月"}, {"id": "9","name": "9 月"}, {"id": "8","name": "8 月"}, {"id": "7","name": "7 月"}, {"id": "6","name": "6 月"}, {"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "3","name": "3 月"}, {"id": "4","name": "4 月"}, {"id": "5","name": "5 月"}, {"id": "12","name": "12 月"}];
      break;
    case 12:
      monthList = [{"id": "12","name": "12 月"}, {"id": "11","name": "11 月"}, {"id": "10","name": "10 月"}, {"id": "9","name": "9 月"}, {"id": "8","name": "8 月"}, {"id": "7","name": "7 月"}, {"id": "1","name": "1 月"}, {"id": "2","name": "2 月"}, {"id": "3","name": "3 月"}, {"id": "4","name": "4 月"}, {"id": "5","name": "5 月"}, {"id": "6","name": "6 月"}];
      break;
  }
  return monthList;
}

