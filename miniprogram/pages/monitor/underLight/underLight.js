import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    realData: {},
    pEchart: null,
    power: {
      lazyLoad: true
    }
  },
  getCurrentMonthlyUsePowerTotal(){ //监测数据统计
    let that = this;
    util.wxRequestGet("/prod-api/sps/undergroundLighting/monitorStatisticsData", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({realData: res.data});
        that.getDailyUsePowerCurve(); //年月数据统计
      }
    }, function(error) {})
  },
  getDailyUsePowerCurve(){ //年月数据统计
    let that = this;
    const date = new Date();
    let params =  {
      deviceBasicId: '',
      type: 'month',
      time: date.getFullYear() + '-' + util.formatMD(date.getMonth() + 1)
    }
    util.wxRequestGet("/prod-api/sps/undergroundLighting/energyConsumptionStatisticsData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(that.data.pEchart==null){
          that.data.pEchart = that.selectComponent('#power-chart');
        }
        let xData = [];
        let pYData = [{ type: 'bar', titles: [], colors: ['#48F0E2'], data: [] }];
        for(let k=0;k<res.data.xaxisData.length;k++){
          let item = res.data.xaxisData[k].split('-');
          xData.push(item[2]+' 日')
        }
        for(let i=0;i<res.data.series.length;i++){
          pYData[0].titles.push(res.data.series[i].name);
          pYData[0].data.push(res.data.series[i].data);
        }
        util.drawMixEChart(echarts, that.data.pEchart, xData, pYData, Math.ceil(xData.length/15));
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getCurrentMonthlyUsePowerTotal(); //监测数据统计
  },
  onReady() {

  }
})