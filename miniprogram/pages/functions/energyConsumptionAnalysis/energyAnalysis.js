import * as util from "../../../utils/util"; 
import * as echarts from '../../component/ec-canvas/echarts'

Page({
  data: {
    condtionDialogHeight: 0,
    searchDataList:{},
    // 配电站数据
    powerStationList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "0","name": "配电站#1"}, {"id": "1","name": "配电站#2"}]
    },
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
    let params = {
      type: 'd', // y(年); m(月); d(年)
      time: this.data.year + '-' + this.data.month + '-' + this.data.day
    }
    console.log(params);
    util.wxRequestPost("/sps/app/PowerAnalysis/getElectricityConsumptionRatio", "加载中...", params, 'application/json', function(res) {
      console.log('根据年月日获取设备能耗占比：默认获取今日');
      console.log(res);
      if(res.success){
        if(res.result != null){
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
    var energyChart = this.selectComponent('#energy-anysis-chart');
    let dataList = [
      { value: 1048, name: '办公 1048kwh'},
      { value: 735, name: '照明 735kwh' },
      { value: 580, name: '备用 580kwh' }
    ]
    this.drawChart(energyChart, dataList)
  },
  //绘制环形图
  drawChart(chartComponnet, dataList) {
    let colorList = ['#1CB7A3','#7A64FF','#FFA63D']
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