import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    detailData:{},
    ec: {
      lazyLoad: true
    }
  },
  getLatestData(){ //获取储能实时数据
    let that = this;
    let params = {
      deviceBasicId: '1791008077239070722'
    }
    util.wxRequestGet("/prod-api/sps/energyStatistics/detectionStatisticsData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code == 200){
        that.setData({detailData: res.data});
        that.getPowerTrend(); //获取储能实时功率曲线
      }
    }, function(error) {})
  },
  getPowerTrend(){ //获取储能实时功率曲线
    let that = this;
    let params = {
      deviceBasicId: '1791008077239070722',
      startTime: util.formatDate(util.getPreviousDate(1)),
			endTime: util.formatDate(util.getPreviousDate(0))
    }
    util.wxRequestGet("/sps/app/device/storeEnergy/getPowerTrend", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.code==200){
        var energyChart = that.selectComponent('#energy-power-chart');
        let xData = [];
				for(let t=0;t<res.data.xaxisData.length;t++){
					xData.push(res.data.xaxisData[t].split(' ')[1]);
				}
				let pYData = [{
					type: 'line', 
					titles: [],
					colors: ['#48FCC2'],
					data: [res.data.series[0].data]
				}];
				util.drawMixEChart(echarts, energyChart, xData, pYData, Math.ceil(xData.length/15));
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
    this.getLatestData();
  },
  onReady() {

  }
})