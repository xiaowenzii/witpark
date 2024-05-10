import * as echarts from '../../component/ec-canvas/echarts'
import {getScreenHeightRpx, getPixelRatio} from "../../../utils/util"

Page({
  data: {
    dateTpye: 0,
    monthList: ["当月", "上月", "5月", "6月", "7月", "8月"],
    monthSelected: 0,
    condtionDialogHeight: 0,
    searchDataList:{},
    // 用能类型
    energyTypeList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "0","name": "全部用能类型"}, {"id": "1","name": "用电"}, {"id": "2","name": "发电"}]
    },
    showSearchDialog: false,
    moreMonth:[1, 2, 9, 10, 11, 12],
    showMoreMonth: false,
    ec: {
      lazyLoad: true
    },
    proList: [
      {type:"照明用电",icon:"../../../asset/energy_overview/zm.png",color:"#18B6A2",percent:"81"},
      {type:"办公用电",icon:"../../../asset/energy_overview/bg.png",color:"#6CB0FF",percent:"50"},
      {type:"电梯用电",icon:"../../../asset/energy_overview/dt.png",color:"#95D676",percent:"40"},
      {type:"其它用电",icon:"../../../asset/energy_overview/qt.png",color:"#74CDFF",percent:"90"}
    ]
  },
  selectDateType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      dateTpye: index
    })
  },
  selectMonth(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      monthSelected: index
    })
  },
  search(res){
    //选择框里面的数据
    var searchDataList = this.data.energyTypeList;
    this.setData({
      searchDataList: searchDataList,
      showSearchDialog: true
    })
  },
  closeDialog: function(e) {
    // 单选
    this.setData({
      energyTypeList: e.detail.data,
      showSearchDialog: false
    })
  },
  showMonth(){
    var showMoreMonth = !this.data.showMoreMonth;
    this.setData({
      showMoreMonth: showMoreMonth
    })
  },
  selectMonthItem(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      showMoreMonth: false
    })
    console.log(this.data.moreMonth[index]);
  },
  onLoad(options) {
    //绘制图标
    var energyChart = this.selectComponent('#energy-chart-bar');
    var xData = ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07", "04-08"];
    var yData = [85, 100, 34, 24, 46, 98, 80, 62];
    this.drawChart(energyChart, xData, yData)

    // 初始化条件选择框高度
    let rpxHeight = getScreenHeightRpx()-90;
    this.setData({
      condtionDialogHeight: rpxHeight 
    })
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
        x: 48,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:24,  //距离下边
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
