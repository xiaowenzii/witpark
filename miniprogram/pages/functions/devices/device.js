import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util";

Page({
  data: {
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
    weatherInfo: {},
    airData: {}
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
    let that = this;
    let index = res.currentTarget.dataset.index;
    var deviceDetailList = this.data.deviceDetailList;
    if(this.data.typeList[this.data.selected].deviceTypeName == '空调'){
      let isRun = deviceDetailList[index].airConditionerDTO.isRun;
      var changeState = res.detail.value;
      wx.showModal({
        title: '空调开关',
        content: changeState?'确定打开'+deviceDetailList[index].airConditionerDTO.name+'空调？':'确定关闭'+deviceDetailList[index].airConditionerDTO.name+'空调',
        success: function(res) {
          if(res.confirm) {
            deviceDetailList[index].airConditionerDTO.isRun= changeState?'1':'0';
            that.setData({deviceIndex: index, deviceDetailList: deviceDetailList});
            if(that.data.deviceList[index].infraredFlag=='1'){
              that.setAirControl(); //红外控制
            }else{
              that.updateAirConditioner(); //不支持红外，继电器控制开关
            }
          } else if (res.cancel) {
            deviceDetailList[index].airConditionerDTO.isRun= isRun;
            that.setData({deviceDetailList: deviceDetailList});
          }
        }
      })
    } else if(this.data.typeList[this.data.selected].deviceTypeName == '风光储路灯'){
      deviceDetailList[res.currentTarget.dataset.index].streetLightBasicInfoDTO.onoff= res.detail.value?'1':'0';
      deviceDetailList[res.currentTarget.dataset.index].streetLightBasicInfoDTO.loadstate= res.detail.value?'1':'0';
      this.setData({deviceIndex: res.currentTarget.dataset.index, deviceDetailList: deviceDetailList});
      
      this.AppstreetLightController();
    }
  },
  //刷新设备实时数据, 只有空调和风光储路灯有用
  refreshDeviceCurrentData(){
    let that = this;
    let params = {
      deviceTypeId: that.data.typeList[that.data.selected].deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.deviceIndex].deviceBasicId
    }
    util.wxRequestPut("/sps/app/device/refreshDeviceCurrentData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      console.log('刷新设备实时数据');
      console.log(res);
      if(res.data.success){}
    }, function(error) {})
  },
  // 空调控制Dialog
  showAirConditionControlDialog(res){
    if(!this.data.showControlDialog){
      this.setData({showControlDialog: true, deviceIndex: res.currentTarget.dataset.index});
    }
  },
  // 空调设置条件选择
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
  // 风光储路灯选择自动
  lightAuto(res){
    var deviceDetailList = this.data.deviceDetailList;
    deviceDetailList[res.currentTarget.dataset.index].streetLightBasicInfoDTO.onoff= '2';
    this.setData({deviceIndex: res.currentTarget.dataset.index, deviceDetailList: deviceDetailList});

    this.AppstreetLightController();
  },
  // 风光储路灯亮度设置
  sliderChange(res){
    var deviceDetailList = this.data.deviceDetailList;
    deviceDetailList[res.currentTarget.dataset.index].streetLightBasicInfoDTO.light= res.detail.value;
    this.setData({deviceIndex: res.currentTarget.dataset.index, deviceDetailList: deviceDetailList});

    this.AppstreetLightController();
  },
  // 发送空调指令:红外控制
  setAirControl(){
    let that = this;
    let params = {
      deviceSnList: [that.data.deviceList[that.data.deviceIndex].deviceSn],
      isOn: that.data.deviceDetailList[that.data.deviceIndex].airConditionerDTO.isRun=='1'?'0':'1',
      runMode: that.data.runModeList.selected,
      temp: that.data.tempList.selected,
      windDirection: that.data.windDirectionList.selected,
      windSpeed: that.data.windSpeedList.selected
    }
    console.log(params);
    util.wxRequestPost("/sps/app/device/airConditioner/infraredControl", "加载中...", params, 'application/json', function(res) {
      console.log(res)
      if(res.data.success){
        that.refreshDeviceCurrentData();
      }
    }, function(error) {})
  },
  // 继电器开关控制：不支持红外
  updateAirConditioner(){
    let that = this;
    let params = {
      deviceSn: that.data.deviceList[that.data.deviceIndex].deviceSn, //空调sn码
      airRelay: that.data.deviceDetailList[that.data.deviceIndex].airConditionerDTO.isRun, //继电器开关 1-开启;0-关闭
      season: 0, //1-冬季;0-夏季
      isBuzzer: 1 //蜂鸣器开关 1-开启; 0关闭
    }
    console.log(params);
    util.wxRequestPost("/sps/app/device/airConditioner/updateAirConditioner", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        that.refreshDeviceCurrentData();
      }
    }, function(error) {})
  },
  //空调调控
  setAir(res){
    this.setData({showControlDialog: false});
    if(res.currentTarget.dataset.index=='1'){
      this.setAirControl();
    }
  },
  // 风光储路灯设置
  AppstreetLightController(){
    let that = this;
    let params = {
      deviceSn: that.data.deviceList[that.data.deviceIndex].deviceSn, //空调sn码
      onoff: that.data.deviceDetailList[that.data.deviceIndex].streetLightBasicInfoDTO.onoff, //0关 1开 2自动"
      light: that.data.deviceDetailList[that.data.deviceIndex].streetLightBasicInfoDTO.light, //亮度：20-100
    }
    util.wxRequestPost("/sps/app/device/streetlight/operation", "加载中...", params, 'application/json', function(res) {
      console.log(res);
      if(res.data.success){
        that.refreshDeviceCurrentData();
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
      console.log('气象站');
      console.log(res);
      if(res.data.success){
        var weather = res.data.result;
        weather.windLevel = that.getWindLevel(weather.windSpeed);
        that.setData({weatherInfo: weather});
        wx.setStorageSync('weatherInfo', res.data.result);
      }
    }, function(error) {})
  },
  //计算风力等级
  getWindLevel(windSpeed){
    if(windSpeed<1.6){
      return '0-1级';
    }else if(windSpeed>1.5 && windSpeed<5.5){
      return '2-3级';
    }else if(windSpeed>5.4 && windSpeed<10.8){
      return '4-5级';
    }else if(windSpeed>10.7 && windSpeed<17.2){
      return '6-7级';
    }else if(windSpeed>17.1 && windSpeed<24.5){
      return '8-9级';
    }else if(windSpeed>24.4 && windSpeed<32.7){
      return '10-11级';
    }else if(windSpeed>32.6 && windSpeed<41.5){
      return '12级';
    }else if(windSpeed>41.4 && windSpeed<61.3){
      return '13-15级';
    }else if(windSpeed>61.2){
      return '16-17级';
    }
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
    let params = {
      deviceTypeId: that.data.typeList[that.data.selected].deviceTypeId
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null){
          that.setData({deviceListLength: res.data.result.length});
          var dataList = res.data.result.length>8 ? res.data.result.slice(0, 8):res.data.result;
          that.setData({deviceList: dataList});
          var list = new Array(dataList.length); //固定详情数组长度
          that.setData({deviceDetailList: list});
          console.log('设备列表');
          console.log(that.data.deviceList);
          // 获取每个设备详情
          if(that.data.typeList[that.data.selected].deviceTypeName == '小型气象站'){
            that.setData({airStationBasicId: res.data.result[0].deviceBasicId});
            that.refreshWeather();
          }else{
            if(that.data.typeList[that.data.selected].deviceTypeName == '空调'){
              that.getTodayStatisticsVO();
            }
            for (let index = 0; index < dataList.length; index++) {
              that.refreshDevice(that.data.typeList[that.data.selected], index);
            }
            console.log('设备详情列表');
            console.log(that.data.deviceDetailList);
          }
        }
      }else{
        that.setData({deviceList: []});
      }
    }, function(error) {})
  },
  //获取单个设备详情
  refreshDevice(item,  index){
    let that = this;
    let deviceParams = {
      deviceTypeId: item.deviceTypeId,
      deviceBasicId: this.data.deviceList[index].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var detailList = that.data.deviceDetailList;
        detailList[index] = res.result;
          //设备详情列表
        that.setData({deviceDetailList: detailList});
      }
    }, function(error) {})
  },
   // 获取空调设备状态
   getTodayStatisticsVO(){
    let that = this;
    let params = {
      'deviceTypeId': that.data.deviceTypeId,
      'deviceLocation': ''
    }
    util.wxRequestGet("/sps/app/device/airConditioner/getTodayStatisticsVO", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      console.log('获取空调设备状态');
      console.log(res);
      if(res.success){
        that.setData({airData: res.result});
        var deviceChart = that.selectComponent('#device-chart');
        let dataList = [
          {value: parseInt(res.result.onlineCount), name: '在线'},
          {value: parseInt(res.result.deviceCount) - parseInt(res.result.onlineCount) - parseInt(res.result.alarmCount), name: '离线'},
          {value: parseInt(res.result.alarmCount), name: '异常'}
        ]
        that.drawChart(deviceChart, dataList)
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
            formatter: '{total|' + this.data.airData.deviceCount +'}'+ '\n\r' + '{active|设备总数}',
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