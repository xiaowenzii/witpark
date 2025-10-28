import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    deviceTypeId: '',
    realTimeData: {},
    realMonthData:{},
    realAllData:{},
    energyPowerChart: null,
    ec: {
      lazyLoad: true
    }
  },
  getLatestData(){ //获取最新实时数据
    let that = this;
    let deviceParams = {};
    util.wxRequestGet("/prod-api/sps/solar/flower/getRealTimeData", "加载中...", deviceParams, 'application/x-www-form-urlencoded', function(res) {
      if(res.code == 200){
        that.setData({realTimeData: res.data});
        that.getTimeChainData(dateType); //获取统计数据
      }
    }, function(error) {})
  },
  getTimeChainData(dateType){ //获取统计数据
    let that = this;
    // 获取当前日期
    const date = new Date();
    let params = {};
    if(dateType=='month'){
      params =  {
				type: 'month',
				time: date.getFullYear() + '-' + util.formatMD(date.getMonth() + 1)
			}
    }else if(dateType=='year'){
      params =  {
				type: 'year',
				time: date.getFullYear()
			}
    }
    util.wxRequestGet("/prod-api/sps/solarStatistics/getTimeChainData", "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        if(dateType=='month'){
          that.setData({realMonthData: res.data});
        }else{
          that.setData({realAllData: res.data});
          that.getTodayPowerData(); //获得今日功率趋势
        }
      }
    }, function(error) {})
  },
  getTodayPowerData(){ //获得今日功率趋势
    let that = this;
    util.wxRequestGet("/prod-api/sps/solar/flower/getTodayPowerData", "加载中...", {}, 'application/json', function(res) {
      if(res.code==200){
        if(that.data.energyPowerChart==null){
          that.data.energyPowerChart = that.selectComponent('#energy-power-chart');
        }
        let xData = [];
				let trendYData = [{
					type: 'line', 
					titles: [],
					colors: ['#8676FF', '#4875F0', '#FF983C', '#48F0E2'],
					data: []
				}];
				for(let i=0;i<res.data.length;i++){
					trendYData[0].titles.push(res.data[i].keyName);
					trendYData[0].data.push(res.data[i].numericalAxis);
					if((xData.length==0 && res.data[i].timeAxis.length>0) || res.data[i].timeAxis.length>xData.length){
						xData = [];
						for(let t=0;t<res.data[i].timeAxis.length;t++){
							xData.push(res.data[i].timeAxis[t].split(' ')[1]);
						}
					}
				}
				util.drawMixEChart(echarts, that.data.energyPowerChart, xData, trendYData, Math.ceil(xData.length/15));
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({deviceTypeId: options.deviceTypeId});
  },
  onReady() {
    this.getLatestData(); //获取最新实时数据
  }
})