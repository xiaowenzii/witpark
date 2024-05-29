import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util";

Page({
  data: {
    moreMonth:[1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
    showMoreMonth: false,
    scrollWidth: '100%',
    selected: 0, // 设备类型选择
    deviceIndex: 0, //选中的第几个设备，deviceList 的位置
    startX: 0, // 触摸开始的X坐标
    endX: 0, // 触摸结束的X坐标
    threshold: 200, // 设置滑动多少距离后触发事件
    typeList: [],
    deviceList:[],
    deviceDetailList:[],
    deviceListLength: 0,
    deviceChart: {
      lazyLoad: true
    },
    showControlDialog: false,
    runModeList:{selected: 0, list:[{id:0,name:'自动'},{id:1,name:'制冷'},{id:2,name:'除湿'},{id:3,name:'送风'},{id:4,name:'制热'}]},
    tempList:{selected: 0, list:[{id:0,name:'16'},{id:1,name:'17'},{id:2,name:'18'},{id:3,name:'19'},{id:4,name:'20'},{id:5,name:'21'},{id:6,name:'22'},{id:7,name:'23'},{id:8,name:'24'},{id:9,name:'25'},{id:10,name:'26'},{id:11,name:'27'},{id:12,name:'28'},{id:13,name:'29'},{id:14,name:'30'}]},
    windDirectionList:{selected: 0, list:[{id:0,name:'自动'},{id:1,name:'风向 1'},{id:2,name:'风向 2'},{id:3,name:'风向 3'},{id:4,name:'风向 4'}]},
    windSpeedList:{selected: 0, list:[{id:0,name:'自动'},{id:1,name:'风速 1'},{id:2,name:'风速 2'},{id:3,name:'风速 3'}]},
    airStationType: '',
    airStationBasicId: '',
    weatherInfo: {}
  },
  showMonth(){
    var showMoreMonth = !this.data.showMoreMonth;
    this.setData({
      showMoreMonth: showMoreMonth
    })
  },
  selectMonthItem(res){
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
    var deviceDetailList = this.data.deviceDetailList;
    deviceDetailList[res.currentTarget.dataset.index].airConditionerDTO.isRun= res.detail.value?'1':'0';
    this.setData({deviceIndex: res.currentTarget.dataset.index, deviceDetailList: deviceDetailList});
    this.setAirControl();
  },
  // 空调控制Dialog
  showAirConditionControlDialog(res){
    if(!this.data.showControlDialog){
      this.setData({showControlDialog: true, deviceIndex: res.currentTarget.dataset.index});
    }
  },
  // 空调选择
  onChange(res){
    if(res.currentTarget.dataset.item=='运转模式'){
      var runMode = this.data.runModeList;
      runMode.selected = res.detail.value;
      this.setData({runModeList: runMode});
    }else if(res.currentTarget.dataset.item=='温度'){
      var temp = this.data.tempList;
      temp.selected = res.detail.value;
      this.setData({tempList: temp});
    }else if(res.currentTarget.dataset.item=='风速'){
      var windSpeed = this.data.windSpeedList;
      windSpeed.selected = res.detail.value;
      this.setData({windSpeedList: windSpeed});
    }else if(res.currentTarget.dataset.item=='风向'){
      var windDirection = this.data.windDirectionList;
      windDirection.selected = res.detail.value;
      this.setData({windDirectionList: windDirection});
    }
  },
  // 发送空调指令
  setAirControl(){
    this.setData({showControlDialog: false});
    let that = this;
    let params = {
      deviceSnList: that.data.deviceList[that.data.deviceIndex].deviceSn,
      isOn: that.data.deviceDetailList[that.data.deviceIndex].airConditionerDTO.isRun,
      runMode: that.data.runModeList.selected,
      temp: that.data.tempList.selected,
      windDirection: that.data.windDirectionList.selected,
      windSpeed: that.data.windSpeedList.selected
    }
    console.log(params);
    util.wxRequestPost("/sps/app/device/airConditioner/infraredControl", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
      }
    }, function(error) {})
  },
  // 刷新天气
  refreshWeather(){
    let that = this;
    let params = {
      deviceTypeId: that.data.airStationType,
      deviceBasicId: that.data.airStationBasicId
    }
    util.wxRequestPost("/sps/app/device/gas/getLatestData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.data.success){
        that.setData({weatherInfo: res.data.result});
        wx.setStorageSync('weatherInfo', res.data.result);
      }
    }, function(error) {})
  },
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({typeList: res.result})
        for (var i = 0; i < res.result.length; i++) {
          if(res.result[i].deviceTypeName == "小型气象站"){
            that.setData({airStationType: res.result[i].deviceTypeId});
          }
        }
        that.getDeviceDataList();
      }
    }, function(error) {})
  },
  // 获取单个设备列表
  getDeviceDataList(){
    let that = this;
    let item = this.data.typeList[this.data.selected];
    let params = {
      deviceTypeId: item.deviceTypeId
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null){
          that.setData({deviceListLength: res.data.result.length});
          var dataList = res.data.result.length>8 ? res.data.result.slice(0, 8):res.data.result;
          var dataDetailList = [];
          that.setData({deviceList: dataList});
          if(that.data.typeList[that.data.selected].deviceTypeName == '小型气象站'){
            that.setData({airStationBasicId: res.data.result[0].deviceBasicId});
            that.refreshWeather();
          }else{
            // 获取单个设备的详情
            for (let index = 0; index < dataList.length; index++) {
              let deviceParams = {
                deviceTypeId: item.deviceTypeId,
                deviceBasicId: dataList[index].deviceBasicId
              }
              util.wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
                if(res.success){
                  dataDetailList.push(res.result);
                  if(index == dataList.length-1){
                    // 设备详情列表
                    that.setData({deviceDetailList: dataDetailList});
                    console.log('设备详情列表');
                    console.log(that.data.deviceDetailList);
                  }
                }
              }, function(error) {})
            }
          }
          console.log('设备列表');
          console.log(that.data.deviceList);
        }
      }else{
        that.setData({deviceList: []});
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
  onLoad(options) {
    
  },
  onReady() {
    this.setData({weatherInfo: wx.getStorageSync('weatherInfo')});
    wx.getSystemInfo({
      success: (res)  => {
        var scrollWidth = res.windowWidth * (750 / res.windowWidth) - 48;
        this.setData({
          scrollWidth: scrollWidth+"rpx"
        })
      },fail: console.error,
    });
    this.getDeviceType();
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