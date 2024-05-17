import * as echarts from '../../component/ec-canvas/echarts'
import {wxRequestGet} from "../../../utils/util";

Page({
  data: {
    moreMonth:[1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
    showMoreMonth: false,
    scrollWidth: '100%',
    selected: 0,
    startX: 0, // 触摸开始的X坐标
    endX: 0, // 触摸结束的X坐标
    threshold: 200, // 设置滑动多少距离后触发事件
    typeList: [],
    deviceList:[],
    deviceChart: {
      lazyLoad: true
    }
  },
  showMonth(){
    var showMoreMonth = !this.data.showMoreMonth;
    this.setData({
      showMoreMonth: showMoreMonth
    })
  },
  selectMonthItem(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      showMoreMonth: false
    })
  },
  // 选择设备类型
  selecteDevice(res){
    var index = res.currentTarget.dataset.index
    this.setData({selected: index})
    // 获取设备列表
    this.getDeviceDataList();
  },
  // switch 开关
  switchState(res){
    console.log(res.currentTarget.dataset.item);
  },
  touchStart: function(e) {
    this.data.startX = e.touches[0].clientX;
  },
  touchMove: function(e) {
    this.data.endX = e.touches[0].clientX;
  },
  touchEnd: function(e) {
    const deltaX = this.data.endX - this.data.startX;
    if (Math.abs(deltaX) > this.data.threshold) {
      if (deltaX > 0) {
        // 右滑
        if(this.data.selected > 0){
          let selected = this.data.selected - 1;
          this.setData({selected: selected})
        }
      } else {
        // 左滑
        if(this.data.selected != (this.data.typeList.length-1)){
          let selected = this.data.selected + 1;
          this.setData({selected: selected})
        }
      }
      // 获取设备列表
      this.getDeviceDataList();
    }
  },
  onLoad(options) {
    wx.getSystemInfo({
      success: (res)  => {
        var scrollWidth = res.windowWidth * (750 / res.windowWidth) - 48;
        this.setData({
          scrollWidth: scrollWidth+"rpx"
        })
      },fail: console.error,
    });
    
    this.getDeviceType();
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    let params = {
      token: wx.getStorageSync('token')
    }
    wxRequestGet("/sps/app/device/listDeviceType", "加载中...", params, function(res) {
      if(res.success){
        that.setData({typeList: res.result})
        that.getDeviceDataList();
      }else{
        wx.showToast({
          icon: "none",
          title: (res.message)
        });
      }
    }, function(error) {})
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let item = this.data.typeList[this.data.selected];
    let params = {
      token: wx.getStorageSync('token'),
      deviceTypeId: item.deviceTypeId
    }
    wxRequestGet("/sps/app/device/listDevice", "加载中...", params, function(res) {
      if(res.success){
        if(res.result != null){
          let dataList = res.result.length>8 ? res.result.slice(0, 8):res.result;
          that.setData({deviceList: dataList});
          // 获取单个设备的详情
          for (let index = 0; index < dataList.length; index++) {
            let deviceParams = {
              token: wx.getStorageSync('token'),
              deviceTypeId: item.deviceTypeId,
              deviceBasicId: dataList[index].deviceBasicId
            }
            wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, function(res) {
              if(res.success){
                if(res.result != null){
                  dataList[index].detail = res.result;
                }
              }else{
              }
            }, function(error) {})
          }
        }
      }else{
        wx.showToast({
          icon: "none",
          title: (res.message)
        });
      }
    }, function(error) {})
  },
  goMoreList(){
    const params = {
      selected: this.data.selected,
      typeList: this.data.typeList
    }
    wx.navigateTo({
      url: '../../../pages/functions/devicesList/list?params='+ JSON.stringify(params),
    })
  },
  onReady() {
    var deviceChart = this.selectComponent('#device-chart');
    let dataList = [
      {value: 21, name: '正常设备'},
      {value: 4, name: '未运行设备'},
      {value: 1, name: '异常设备'}
    ]
    this.drawChart(deviceChart, dataList)
  },
  //绘制环形图
  drawChart(chartComponnet, dataList) {
    let colorList = ['#1CB7A3','#DCDCDC','#FFA63D']
    var option = {
      series: [{
        type:'pie',
        radius: ['80%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color:'#4c4a4a',
            formatter: '{total|' + 26 +'}'+ '\n\r' + '{active|设备总数}',
            rich: {
              total:{
                fontSize: 24,
                fontFamily : "微软雅黑",
                fontWeight: "bolder",
                color:'#454c5c'
              },
              active: {
                fontFamily : "微软雅黑",
                fontSize: 14,
                color:'#6c7a89',
                lineHeight:30,
              },
            }
          },
          emphasis: {
            show: true,//中间文字显示
          }
        },
        color: colorList,
        data: dataList.map((item, index) => {
          item.label = {
            color: colorList[index],
            color: 'inherit'
          }
          return item
        }) 
      }]
    };
    const getPixelRatio = () => {
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
    var dpr = getPixelRatio()
    if (chartComponnet) {
      chartComponnet.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr
        }); 
        chart.setOption(option, true);
        return chart;
      });
    }
  }
})