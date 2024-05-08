import {deviceIcon, getScreenHeightRpx} from "../../../utils/util"; 
import * as echarts from '../../component/ec-canvas/echarts'

Page({
  data: {
    condtionDialogHeight: 0,
    searchDataList:{},
    // 配电站数据
    powerStationList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "0","name": "配电站#1"}, {"id": "1","name": "配电站#2"}, {"id": "2","name": "配电站#3"}, {"id": "1","name": "配电站#4"}, {"id": "2","name": "配电站#5"}, {"id": "1","name": "配电站#6"}, {"id": "2","name": "配电站#7"}, {"id": "1","name": "配电站#8"}, {"id": "2","name": "配电站#9"}, {"id": "1","name": "配电站#10"}, {"id": "2","name": "配电站#11"}, {"id": "1","name": "配电站#12"}, {"id": "2","name": "配电站#13"}]
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
    }, {
      type: '2',
      icon: '',
      desc: '充电桩',
      yd: '234',
      ydgl: '2200'
    }, {
      type: '3',
      icon: '',
      desc: '发电单元',
      yd: '234',
      ydgl: '2200'
    }],
    energyAnysisChart: {
      lazyLoad: true
    }
  },
  selectType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      selected: index
    })
  },
  getDeviceIcon(){
    var deviceList = this.data.deviceList;
    for (let index = 0; index < deviceList.length; index++) {
      deviceList[index].icon = '../../../asset/' + deviceIcon({type: deviceList[index].type});
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
  onLoad(options) {
    this.getDeviceIcon();
    // 初始化条件选择框高度
    let rpxHeight = getScreenHeightRpx()-360;
    this.setData({
      condtionDialogHeight: rpxHeight 
    })
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