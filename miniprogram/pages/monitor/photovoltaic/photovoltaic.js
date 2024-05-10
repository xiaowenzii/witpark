import * as echarts from '../../component/ec-canvas/echarts'
import {getPixelRatio} from "../../../utils/util"

Page({
  data: {
    ec: {
      lazyLoad: true
    }
  },
  onLoad(options) {
    //绘制折线图
    var energyChart = this.selectComponent('#energy-power-chart');
    var xData = ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07", "04-08"];
    var yData = [85, 100, 34, 24, 46, 98, 80, 62];
    this.drawChart(energyChart, xData, yData)
  },
  onReady() {

  },
  //绘制曲线图
  drawChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval:0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: yData,
        type: 'line',
        smooth: false
      }],
      grid:{
        x: 24,  //距离左边
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