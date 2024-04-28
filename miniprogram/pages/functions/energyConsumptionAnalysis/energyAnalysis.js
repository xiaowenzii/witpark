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
    energyAnysisChart: {lazyLoad: true}
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
    
    var energyChart = this.selectComponent('#energy-anysis-chart');
    this.drawChart(energyChart)
  },
  onReady() {

  },
  // 绘制柱状图
  drawChart(chartComponnet) {
    var option = {
      //设置颜色
      color: ['#344EFF', '#93F1D3','#FA7B4B','#9FE080'],
      legend:{
        data: ['办公','照明','备用'],
        top: "75%"
      },
      series:[{
        data: [{name: "办公", value: "151749.86"}, {name: "照明",value: "375527.67"}, {name: "备用", value: "471755.13"}],
        label: {
          normal: {
            //设置文字样式
            formatter: "{a|} \n {b} \n{hr|}\n {d}% \n {c}元",
            show: true,
            position: 'right',
            rich: {
              a: {
                padding: [0, -80, -15, -80]
              },
              hr: {
                height: 5,
                width: 5,
                backgroundColor: 't',
                lineHeight: 5,
                marginBottom: 10,
                padding: [0, -5],
                borderRadius: 5,
              }
            },
          }
        },
        avoidLabelOverlap: true
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