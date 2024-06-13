import * as util from "../../../utils/util"; 
import * as echarts from '../../component/ec-canvas/echarts'

Page({
  data: {
    condtionDialogHeight: 0,
    searchDataList:{},
    // 电表数据
    powerStationList: {
      "type": 0,
      "selected": "0",
      "list": []
    },
    pPower:{},
    uPower:{},
    showSearchDialog: false,
    selected: 0,
    deviceList: [],
    deviceListDetail:[],
    usePower:{deviceList:[], deviceListDetail:[]},
    createPower:{deviceList:[], deviceListDetail:[]},
    energyAnysisChart: {
      lazyLoad: true
    },
    colorList: ['#1CB7A3','#7A64FF','#FFA63D', '#57AD0A','#B1C7FF','#0B2186','#55D86B'],
    year:'',
    month:'',
    day:'',
    todayPower: 0, //今日总用电：用电设备相加
    todayP: 0,      //电网功率：用电设备功率相加
    todayCreatePower: 0,
    buyPower: 0,
    sellPower: 0
  },
  selectType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selected: index
    })
    if(index=='0'){
      this.setData({deviceList: this.data.usePower.deviceList, deviceListDetail: this.data.usePower.deviceListDetail});
    }else{
      this.setData({deviceList: this.data.createPower.deviceList, deviceListDetail: this.data.createPower.deviceListDetail});
    }
  },
  search(res){
    if(this.data.showSearchDialog){
      this.setData({
        showSearchDialog: false
      })
    }else{
      //选择框里面的数据
      var searchDataList = this.data.powerStationList;
      this.setData({
        searchDataList: searchDataList,
        showSearchDialog: true
      })
    }
  },
  closeDialog: function(e) {
    // 单选
    this.setData({
      powerStationList: e.detail.data,
      showSearchDialog: false
    })
    this.getPowerRoomDeviceElectric();
    this.getPowerRoomDevicePowerMaxMin();
  },
  // 根据配电柜获取电表
  getPowerDeviceByBasicId(){
    let that = this;
    let params = {
      deviceBelonging: ''
    }
    util.wxRequestGet("/sps/app/device/PowerRoom/getPowerDeviceByBasicId", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var list = that.data.powerStationList;
        for (let i = 0; i < res.result.length; i++) {
          list.list.push({id: res.result[i].powerroomDeviceId, name: res.result[i].deviceName});
          if(i == res.result.length-1){
            that.setData({powerStationList: list});
            that.getPowerRoomDeviceElectric();
            that.getPowerRoomDevicePowerMaxMin();
          }
        }
      }
    }, function(error) {})
  },
  // 根据电表和时间查询电量
  getPowerRoomDeviceElectric(){
    let that = this;
    let params = {
      "meter": that.data.powerStationList.list[that.data.powerStationList.selected].id,
      "room": "",
      "starTime": this.data.year + '-' + this.data.month + '-' + this.data.day,
      "endTime": this.data.year + '-' + this.data.month + '-' + this.data.day
    }
    util.wxRequestPost("/sps/app/device/PowerRoom/getPowerRoomDeviceElectric", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result!=null&&res.data.result.length>0){
          that.setData({uPower: res.data.result[0]});
        }
      }
    }, function(error) {})
  },
  // 根据电表和时间查最大功率和最小功率
  getPowerRoomDevicePowerMaxMin(){
    let that = this;
    let params = {
      "meter": that.data.powerStationList.list[that.data.powerStationList.selected].id,
      "room": "",
      "starTime": this.data.year + '-' + this.data.month + '-' + this.data.day,
      "endTime": this.data.year + '-' + this.data.month + '-' + this.data.day
    }
    util.wxRequestPost("/sps/app/device/PowerRoom/getPowerRoomDevicePowerMaxMin", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var data = res.data.result[0];
        data.maxPower = (res.data.result[0].maxPower/1000).toFixed(2);
        data.minPower = (res.data.result[0].minPower/1000).toFixed(2);
        that.setData({pPower: data});
      }
    }, function(error) {})
  },
  // 根据年月日获取设备能耗占比：默认获取今日
  getElectricityConsumptionRatio(){
    let that = this;
    let params = {
      type: 'd', // y(年); m(月); d(年)
      time: this.data.year + '-' + this.data.month + '-' + this.data.day
    }
    util.wxRequestPost("/sps/app/PowerAnalysis/getElectricityConsumptionRatio", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        that.setData({powerPerDeviceListData: res.data.result.proportion});
        var energyChart = that.selectComponent('#energy-anysis-chart');
        var dataList = [];
        for (let i = 0; i < res.data.result.proportion.length; i++) {
          dataList.push({value: res.data.result.proportion[i].val, name: res.data.result.proportion[i].name+' '+res.data.result.proportion[i].val+' kWh'});
          if(i == res.data.result.proportion.length-1){
            that.drawChart(energyChart, dataList);
          }
        }
      }
    }, function(error) {})
  },
  //获取用电列表设备
  getAllPowerRoomDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/PowerAnalysis/getAllPowerRoomDeviceType", "加载中...", {}, 'application/json', function(res) {
      if(res.success){
        var useP = that.data.usePower;
        useP.deviceList = res.result;
        useP.deviceListDetail = new Array(res.result.length);
        that.setData({deviceList: res.result, deviceListDetail: new Array(res.result.length), usePower: useP})
        for (let i = 0; i < res.result.length; i++) {
          that.getComprehensivePowerRight(i);//获取各设备用电详细
        }
      }
    }, function(error) {})
  },
  //获取发电列表设备
  getAllGenerationDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/PowerAnalysis/getAllGenerationDeviceType", "加载中...", {}, 'application/json', function(res) {
      if(res.success){
        var creatP = that.data.createPower;
        creatP.deviceList = res.result;
        creatP.deviceListDetail = new Array(res.result.length);
        that.setData({createPower: creatP});
        for (let i = 0; i < res.result.length; i++) {
          that.getComprehensivePowerLeft(i);//获取各设备发电详细
        }
      }
    }, function(error) {})
  },
  // 获取园区综合能流图(右边用电电设备)
  getComprehensivePowerRight(index){
    let that = this;
    var params = {
      deviceTypeId: that.data.deviceList[index].powerroomDeviceTypeId
    }
    util.wxRequestGet("/sps/app/PowerAnalysis/getComprehensivePowerRight", "加载中...", params, 'application/json', function(res) {
      if(res.success){
        if(res.result != null){
         var useP = that.data.usePower;
         useP.deviceListDetail[index] = res.result;
         useP.deviceListDetail[index].sumPower = (parseFloat(res.result.sumPower)/1000).toFixed(2);

         var power = that.data.todayPower;
         var powerP = that.data.todayP;
         power = (parseFloat(power) + parseFloat(res.result.sumElectricity)).toFixed(2);
         powerP = parseFloat(parseFloat(powerP) + parseFloat(useP.deviceListDetail[index].sumPower)).toFixed(2);
         that.setData({
           deviceListDetail: useP.deviceListDetail, 
           todayPower: power, 
           todayP: powerP, 
           usePower:useP, 
           buyPower: (power-that.data.todayCreatePower).toFixed(2),
           sellPower:(that.data.todayCreatePower-power).toFixed(2)
          });
        }
      }
    }, function(error) {})
  },
  // 获取园区综合能流图(左边发电设备)
  getComprehensivePowerLeft(index){
    let that = this;
    var params = {
      deviceTypeId: that.data.createPower.deviceList[index].deviceTypeId
    }
    util.wxRequestGet("/sps/app/PowerAnalysis/getComprehensivePowerLeft", "加载中...", params, 'application/json', function(res) {
      if(res.success){
        if(res.result != null){
          var power = that.data.todayCreatePower;
          var creatP = that.data.createPower;
          power = (parseFloat(power) + parseFloat(res.result.sumElectricity)).toFixed(2);

          creatP.deviceListDetail[index] = res.result;
          creatP.deviceListDetail[index].sumPower = (parseFloat(res.result.sumPower)/1000).toFixed(2);
          that.setData({
            todayCreatePower: power, 
            createPower: creatP, 
            buyPower:(that.data.todayPower-power).toFixed(2), 
            sellPower: (power-that.data.todayPower).toFixed(2)
          });
        }
      }
    }, function(error) {})
  },
  onLoad(options) {
    // 初始化条件选择框高度
    let rpxHeight = util.getScreenHeightRpx()-360;
    // 获取当前日期
    const date = new Date();
    this.setData({
      condtionDialogHeight: rpxHeight,
      year: date.getFullYear(),
      month: util.formatMD(date.getMonth() + 1),
      day: util.formatMD(date.getDate())
    })
  },
  onReady() {
    this.getPowerDeviceByBasicId();
    this.getElectricityConsumptionRatio();
    this.getAllPowerRoomDeviceType();//用电设备
    this.getAllGenerationDeviceType();//发电设备
  },
  //绘制环形图
  drawChart(chartComponnet, dataList) {
    let colorList = this.data.colorList;
    var option = {
      series: [{
        type: 'pie',
        radius: ['50%','80%'],
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
    var dpr = util.getPixelRatio()
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