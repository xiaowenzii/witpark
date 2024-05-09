import * as echarts from '../../component/ec-canvas/echarts'
import {getScreenHeightRpx} from "../../../utils/util"; 

Page({
  data: {
    condtionDialogHeight: 0,
    searchDataList:{},
    floorDataList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "0","name": "旧大楼#1楼"}, {"id": "1","name": "旧大楼#2楼"}, {"id": "2","name": "旧大楼#3楼"}, {"id": "1","name": "旧大楼#4楼"}, {"id": "2","name": "旧大楼#5楼"}]
    },
    showSearchDialog: false,
    ec: {
      lazyLoad: true
    }
  },
  search(res){
    if(this.data.showSearchDialog){
      this.setData({
        showSearchDialog: false
      })
    }else{
      //选择框里面的数据
      var searchDataList = this.data.floorDataList;
      this.setData({
        searchDataList: searchDataList,
        showSearchDialog: true
      })
    }
  },
  closeDialog: function(e) {
    // 单选
    this.setData({
      floorDataList: e.detail.data,
      showSearchDialog: false
    })
  },
  onLoad(options) {
    // 初始化条件选择框高度
    let rpxHeight = getScreenHeightRpx()-90;
    this.setData({
      condtionDialogHeight: rpxHeight 
    })

    //绘制图标
    var energyChart = this.selectComponent('#energy-chart-bar');
    var xData = ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07", "04-08"];
    var yData = [85, 100, 34, 24, 46, 98, 80, 62];
    this.drawChart(energyChart, xData, yData)

    var timeChart = this.selectComponent('#time-chart-bar');
    var xTData = ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07", "04-08"];
    var yTData = [185, 100, 134, 124, 146, 198, 180, 162];
    this.drawChart(timeChart, xTData, yTData)
  },

  onReady() {

  },
  // 绘制柱状图
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
        x: 30,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:24,  //距离下边
      }
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