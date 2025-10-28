import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    realData: {},
    tempEchart: null,
    water: {
      lazyLoad: true
    }
  },
  getHeatPumpTendency(key){  //获得热泵信息
    let that = this;
    let params = {};
    util.wxRequestGet("/prod-api/sps/heat/pump/getWaterTankInfo", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({realData: res.data});
        that.getTodayWaterTankTemp(); //获得当天热泵温度统计
      }
    }, function(error) {})
  },
  getTodayWaterTankTemp(){ //获得当天热泵温度统计
    let that = this;
    let params = {};
    util.wxRequestGet("/prod-api/sps/heat/pump/getTodayWaterTankTemp", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(res.data.length>0){
          if(that.data.tempEchart==null){
            that.data.tempEchart = that.selectComponent('#water-chart');
          }
          let xData = [];
          let pYData = [{
            type: 'line', 
            titles: ['水箱温度（℃）'],
            colors: ['#FFB586'],
            data: [res.data[0].numericalAxis]
          }];
          for(let k=0;k<res.data[0].timeAxis.length;k++){
            xData.push(res.data[0].timeAxis[k].split(' ')[1]);
          }
          util.drawMixEChart(echarts, that.data.tempEchart, xData, pYData, Math.ceil(xData.length/12));
        }
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
  },
  onReady() {
    this.getHeatPumpTendency(); //获得热泵信息
  }
})