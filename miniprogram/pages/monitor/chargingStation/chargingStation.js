import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    monitorStatisticsData: {},
    pEcharts: null,
    monthp: {
      lazyLoad: true
    }
  },
  getMonitorStatisticsData(){ //充电桩监测数据
    let that = this;
    let params = {
      deviceBasicId: '520'
    }
    util.wxRequestGet("/prod-api/sps/storageChargingPileStatisticsData/monitorStatisticsData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        that.setData({monitorStatisticsData: res.data});
        that.getDailyChargingCurve(); //充电桩月年数据统计
      }
    }, function(error) {})
  },
  getDailyChargingCurve(){ //充电桩月年数据统计
    let that = this;
    let deviceParams = {
      deviceBasicId: '520',
      type: 'month',
      time: util.formatDate(util.getPreviousDate(0))
    }
    util.wxRequestGet("/prod-api/sps/storageChargingPileStatisticsData/energyEchartsStatisticsData", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        if(that.data.pEcharts==null){
          that.data.pEcharts = that.selectComponent('#monthp-chart');
        }
        let xData = [];
        let pYData = [
          { type: 'bar', titles: [], colors: ['#FE9800', '#8095FF'], data: [] }, 
          { type: 'line', titles: [], colors: ['#FFA56B'], data: [] }
        ];
        for(let i=0;i<res.data.xaxisData.length;i++){
          let item = res.data.xaxisData[i].split('-');
          xData.push(that.dateType=='month'?(item[1]+'-'+item[2]):item[1]);
        }
        for(let i=0;i<res.data.series.length;i++){
          titles.push(res.data.series[i].name);
          if(res.data.series[i].name=='充电时长'){
            pYData[0].titles.push('充电时长');
            pYData[0].data.push(res.data.series[i].data);
          }
          if(res.data.series[i].name=='充电量'){
            pYData[0].titles.push('充电量');
            pYData[0].data.push(res.data.series[i].data);
          }
          if(res.data.series[i].name=='收益'){
            pYData[1].titles.push('收益');
            pYData[1].data.push(res.data.series[i].data);
          }
        }
        util.drawMixEChart(echarts, that.data.pEcharts, xData, pYData, 1);
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getMonitorStatisticsData(); //充电桩监测数据
  },
  onReady() {

  }
})