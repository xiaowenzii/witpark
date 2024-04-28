import {deviceIcon} from "../../../utils/util"; 
import * as echarts from '../../component/ec-canvas/echarts'

Page({
  data: {
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
  onLoad(options) {
    this.getDeviceIcon();
  },
  onReady() {
    var energyChart = this.selectComponent('#energy-anysis-chart');
    this.drawChart(energyChart)
  },
  drawChart(chartComponnet) {
    let colorList = ['#1CB7A3','#7A64FF','#FFA63D']
    let dataList = [
      { value: 1048, name: '办公 1048kwh'},
      { value: 735, name: '照明 735kwh' },
      { value: 580, name: '备用 580kwh' }
    ]
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
        }),
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