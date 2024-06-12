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
    deviceList: [{
      type: '0',
      icon: '',
      desc: '空调',
      yd: '234',
      ydgl: '2200'
    }, {
      type: '1',
      icon: '',
      desc: '空气源热泵',
      yd: '234',
      ydgl: '2200'
    }],
    energyAnysisChart: {
      lazyLoad: true
    },
    colorList: ['#1CB7A3','#7A64FF','#FFA63D', '#57AD0A','#B1C7FF','#0B2186','#55D86B'],
    year:'',
    month:'',
    day:''
  },
  selectType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selected: index
    })
  },
  // 设置图标
  getDeviceIcon(){
    var deviceList = this.data.deviceList;
    for (let index = 0; index < deviceList.length; index++) {
      var icon = '';
      switch (deviceList[index].type) {
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
      deviceList[index].icon = '../../../asset/' + icon;
    }
    this.setData({
      deviceList: deviceList
    })
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
      console.log('根据配电柜获取电表');
      console.log(res);
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
      console.log('根据电表和时间查询电量');
      console.log(res.data.result);
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
        console.log('最大功率和最小功率');
        console.log(res.data.result[0]);
        var data = res.data.result[0];
        data.maxPower = (res.data.result[0].maxPower/1000).toFixed(2);
        data.minPower = (res.data.result[0].minPower/1000).toFixed(2);
        that.setData({pPower: data});
      }
    }, function(error) {})
  },
  // 获取园区综合能流图
  getComprehensivePower(){
    util.wxRequestPost("/sps/app/PowerAnalysis/getComprehensivePower", "加载中...", {}, 'application/json', function(res) {
      console.log('获取园区综合能流图');
      console.log(res);
      if(res.success){
        if(res.result != null){
        }
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
      console.log('根据年月日获取设备能耗占比：默认获取今日');
      console.log(res);
      if(res.data.success){
        that.setData({powerPerDeviceListData: res.data.result.proportion});
        var energyChart = that.selectComponent('#energy-anysis-chart');
        var dataList = [];
        for (let i = 0; i < res.data.result.proportion.length; i++) {
          dataList.push({value: res.data.result.proportion[i].val, name: res.data.result.proportion[i].name+' '+res.data.result.proportion[i].val+' kwh'});
          if(i == res.data.result.proportion.length-1){
            that.drawChart(energyChart, dataList);
          }
        }
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.getDeviceIcon();
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

    this.getElectricityConsumptionRatio();
    this.getComprehensivePower();
  },
  onReady() {
    this.getPowerDeviceByBasicId();
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