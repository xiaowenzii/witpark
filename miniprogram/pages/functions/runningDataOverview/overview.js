import * as echarts from '../../component/ec-canvas/echarts'
import {getPixelRatio} from "../../../utils/util"

Page({
  data: {
    deviceType: 0,
    realTimePowerChart: {
      lazyLoad: true
    }
  },
  selectDevice(res){
    var type = res.currentTarget.dataset.index;
    this.setData({
      deviceType: type
    })
  },
  onLoad(options) {
  },
  onReady() {
    var realTimePowerChart = this.selectComponent('#real-time-power-chart');
    var xData = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    var yData = [320, 932, 301, 434, 390, 1330, 1320, 132, 201, 334, 490, 1530, 620, 72, 801, 934, 390, 230, 520, 932, 701, 734, 490, 1330];
    this.drawChart(realTimePowerChart, xData, yData)
  },
  //绘制曲线图
  drawChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval:3
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: yData,
        type: 'line',
        smooth: true
      }],
      grid:{
        x: 48,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:36,  //距离下边
      }
    };
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