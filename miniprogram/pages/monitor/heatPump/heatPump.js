import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    deviceList: [],
    detailData: {},
    selectDeviceIndex: 0,
    date: '',
    power: {
      lazyLoad: true
    },
    water: {
      lazyLoad: true
    }
  },
  // 获取设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: that.data.deviceTypeId
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(res.data.result != null && res.data.result.length > 0){
          that.setData({deviceList: res.data.result});

          that.refreshDevice();
          that.getHeatPumpTendency('dis');//水位
          that.getHeatPumpTendency('pre_temp');//水箱温度
        }
      }
    }, function(error) {})
  },
  //获取单个设备详情
  refreshDevice(){
    let that = this;
    let deviceParams = {
      deviceTypeId: that.data.deviceTypeId,
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId
    }
    util.wxRequestGet("/sps/app/device/refreshDevice", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({detailData: res.result.heatPumpDTO});
      }
    }, function(error) {})
  },
  // 根据key获取当天热泵趋势数据
  getHeatPumpTendency(key){
    let that = this;
    let params = {
      key: key, //需要统计的key,示例值(liq_lev(液位) or sup_temp(供水温度) or re_temp(回水温度))
      deviceBasicId: that.data.deviceList[that.data.selectDeviceIndex].deviceBasicId,
      startTime: that.data.date + ' 00',
      endTime: that.data.date + ' 23'
    }
    if(key!='dis'){
      params.deviceType = 8; //6:进水 7：出水 8：水箱
    }
    util.wxRequestGet("/sps/app/device/heatPump/getHeatPumpTendency", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      var data = res.result[Object.keys(res.result)[0]];
      if(res.success){
        var xData = [];
        var yData = [];
        for (let index = 0; index < data.length; index++) {
          xData.push(parseInt(data[index].time.split(' ')[1]));
          if(key=='dis'){
            yData.push(data[index].value/1000);
          }else{
            yData.push(data[index].value);
          }
        }
        if(key=='dis'){
          var chart = that.selectComponent('#power-chart');
          that.drawPowerChart(chart, xData, yData)
        }else{
          chart = that.selectComponent('#water-chart');
          that.drawChart(chart, xData, yData);
        }
      }else{}
    }, function(error) {})
  },
  onLoad(options) {
    // 获取当前日期
    const date = new Date();
    this.setData({deviceTypeId: options.deviceTypeId, date: date.getFullYear()+'-'+(util.formatMD(date.getMonth() + 1))+'-'+util.formatMD(date.getDate())});
  },
  onReady() {
    this.getDeviceDataList();
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
          type: 'value',
          axisLabel:{
            textStyle: {fontSize: 10}
          }
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
        type: 'value',
        axisLabel:{
          textStyle: {fontSize: 10}
        }
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