import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    power: {
      lazyLoad: true
    },
    water: {
      lazyLoad: true
    }
  },
  // 根据key获取当天热泵趋势数据
  getHeatPumpTendency(){
    let that = this;
    let params = {
      key: 'sup_temp' //需要统计的key,示例值(liq_lev(液位) or sup_temp(供水温度) or re_temp(回水温度))
    }
    util.wxRequestGet("/sps/app/device/heatPump/getHeatPumpTendency", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      console.log('根据key获取当天热泵趋势数据');
      console.log(res);
      if(res.success){
        //绘制柱状图
        var chart = that.selectComponent('#power-chart');
        var xData = ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07", "04-08"];
        var yData = [85, 100, 34, 24, 46, 98, 80, 62];
        that.drawPowerChart(chart, xData, yData)

        //绘制折线图
        chart = that.selectComponent('#water-chart');
        that.drawChart(chart, xData, yData);
      }else{}
    }, function(error) {})
  },
  onLoad(options) {
    this.getHeatPumpTendency();
  },
  onReady() {

  },
  // 绘制柱状图
  drawPowerChart(chartComponnet, xData, yData) {
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
        name: '用电数据',
        type: 'bar',
        label:{
          show: true, 
          position: 'top',
          formatter: (value,index)=> { 
            return value?.value;
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 1,
            color: { type: 'linear', x: 1, y: 0, x2: 0,  y2: 1,
              colorStops: [{
                offset: 0,
                color: '#18B6A2' //0% 处的颜色
              }, {
                offset: 1,
                color: '#E7F8F5' //100% 处的颜色
              }],
              globalCoord: true, //缺省为false
            },
            barBorderRadius: [0, 0, 0, 0], //柱状图radius
            label: {
              show: false, //柱状图顶部是否显示数值
              position: 'top',
              textStyle: {
                color: '#222222'
              },
              formatter: function (params) {
                if (params.value == 0) {
                  return '';
                } else {
                  return params.value;
                }
              }
            },
          },
        },
        data: yData
      }],
      grid:{
        x: 24,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:36,  //距离下边
      }
    };
    
    var dpr = util.getPixelRatio();
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
  },
  //绘制折线图
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
    var dpr = util.getPixelRatio();
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