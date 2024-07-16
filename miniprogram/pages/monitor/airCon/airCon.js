import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"; 

Page({
  data: {
    condtionDialogHeight: 0,
    deviceTypeId:'',
    airData: {}, //空调数据
    searchDataList:{},
    floorDataList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "1","name": "旧大楼#1楼",code:"C03A02A01"}, {"id": "2","name": "旧大楼#2楼",code:"C03A02A02"}, {"id": "4","name": "旧大楼#4楼",code:"C03A02A03"}, {"id": "5","name": "旧大楼#5楼",code:"C03A02A04"}]
    },
    showSearchDialog: false,
    ec: {
      lazyLoad: true
    },
    year:'',
    month:'',
    day:''
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
    // 获取空调设备数据，用电及用电时长
    this.getTodayStatisticsVO();
    this.getMonthUsedData(1, 'd'); //按日获取用电量
    this.getMonthUsedData(2, 'd'); //按日获取用电时长
  },
  // 获取今日设备信息统计
  getTodayStatisticsVO(){
    let that = this;
    let params = {
      'deviceTypeId': that.data.deviceTypeId,
      'deviceLocation': this.data.floorDataList.list[this.data.floorDataList.selected].code
    }
    util.wxRequestGet("/sps/app/device/airConditioner/getTodayStatisticsVO", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({airData: res.result})
      }
    }, function(error) {})
  },
  // 按时间获取空调月份统计数据
  getMonthUsedData(keyFlag, statisticType){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId,
      deviceLocation: this.data.floorDataList.list[this.data.floorDataList.selected].code,
      keyFlag: keyFlag,//查询数据标识 1：获取用电量 2：获取用电时长
      statisticType: statisticType, //查询日期标识 'm'：按月统计 'd'：按日统计
      startDate: that.data.year + '-'+that.data.month+'-'+that.data.day,
      endDate: that.data.year + '-'+that.data.month+'-'+that.data.day
    }
    util.wxRequestGet("/sps/app/device/airConditioner/getMonthUsedData", "加载中...", params, 'application/x-www-form-urlencoded',function(res) {
      if(res.success){
        var xData = [];
        var yData = [];
        for (let index = 0; index < res.result.length; index++) {
          xData.push(parseInt(res.result[index].date.split('-')[2]));
          if(keyFlag==1){
            yData.push(res.result[index].value);
          }else{
            yData.push(res.result[index].value/60);
          }
        }
        if(keyFlag==1){
          //绘制图标
          var energyChart = that.selectComponent('#energy-chart-bar');
          that.drawChart(energyChart, xData, yData)
        }else{
          var timeChart = that.selectComponent('#time-chart-bar');
          that.drawChart(timeChart, xData, yData)
        }
      }
    }, function(error) {})
  },
  onLoad(options) {
    // 获取设备ID
    this.setData({
      deviceTypeId: options.deviceTypeId
    });
  },

  onReady() {
    // 初始化条件选择框高度
    let rpxHeight = util.getScreenHeightRpx()-90;
    // 获取当前日期
    const date = new Date();
    this.setData({
      condtionDialogHeight: rpxHeight,
      year: date.getFullYear(),
      month: util.formatMD(date.getMonth() + 1),
      day: util.formatMD(date.getDate())
    })
    // 获取空调设备数据，用电及用电时长
    this.getTodayStatisticsVO();
    this.getMonthUsedData(1, 'd'); //按日获取用电量
    this.getMonthUsedData(2, 'd'); //按日获取用电时长
  },
  // 绘制柱状图
  drawChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval:1,
          textStyle:{
            fontsize: 10
          }
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
        x: 39,  //距离左边
        x2: 24, //距离右边
        y:24,   //距离上边
        y2:24,  //距离下边
      }
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