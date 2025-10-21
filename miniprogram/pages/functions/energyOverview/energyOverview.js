import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    dateTpye: 'month',
    monthList: [],
    moreMonth:[],
    monthSelected: 1, // 选择的月份
    condtionDialogHeight: 0,
    searchDataList:{},
    // 用能类型
    yearList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "2024","name": "2024（年）"}, {"id": "2025","name": "2025（年）"}, {"id": "2026","name": "2026（年）"}, {"id": "2027","name": "2027（年）"}]
    },
    energyList: ['用电', '发电', '用气', '用水'],
    energyType: 0,//能耗类型
    showSearchDialog: false,
    showMoreMonth: false,
    energyChart: null,
    ec: {
      lazyLoad: true
    },
    useEnergyData: {}
  },
  // 选择时间类别，年或者月
  selectDateType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      dateTpye: index
    })
    this.requestData();
    this.getElectricityConsumptionRanking();
  },
  // 选择月份
  selectMonth(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      monthSelected: index
    })
    this.requestData();
    this.getElectricityConsumptionRanking();
  },
  search(res){
    //选择框里面的数据
    var searchDataList = this.data.yearList;
    this.setData({
      searchDataList: searchDataList,
      showSearchDialog: true
    })
  },
  closeDialog: function(e) {
    // 单选
    this.setData({
      yearList: e.detail.data,
      showSearchDialog: false
    })
    this.requestData();
    this.getElectricityConsumptionRanking();
  },
  // 显示月份下拉菜单
  showMonth(){
    var showMoreMonth = !this.data.showMoreMonth;
    this.setData({
      showMoreMonth: showMoreMonth
    })
  },
  // 下拉月份选择
  selectMonthItem(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      showMoreMonth: false,
      monthSelected: index
    })
   this.requestData();
   this.getElectricityConsumptionRanking();
  },
  // 能耗统计，类型选择
  selectEnergyType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      energyType: index
    })
    this.requestData();
  },
  // 请求集中
  requestData(){
    switch (this.data.energyList[this.data.energyType]) {
      case '用电':
        this.getEnergyOverviewStatisticsData('power');
        break;
      case '发电':
        this.getEnergyOverviewStatisticsData('generPower');
        break;
      case '用气':
        this.getGasStatistics();
        break;
      case '用水':
        this.getWaterStatistics();
        break;
    }
  },
  // 能效总览：用电，发电，用气，用水
  getEnergyOverviewStatisticsData(type){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: this.setTypeTime()
    }
    util.wxRequestPost('/prod-api/sps/energyOverviewStatistics/getEnergyOverviewStatisticsData', "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        if(that.data.energyChart == null){
          that.data.energyChart = that.selectComponent('#energy-chart-bar');
        }
        if(type=='power'){ //用电
          let pYData = [{
            type: 'bar', titles: ['用电量（kWh）'], colors: ['#5772FF'], data: [[]]
          }, {
            type: 'line', titles: ['电费（元）', '碳排量（吨）'], colors: ['#2CD483', '#F49E4F'], data: [[], []]
          }];
          for(let i=0;i<res.data.useEchartsData.series.length;i++){
            if(res.data.useEchartsData.series[i].name=='用电量'){
              pYData[0].data[0] = res.data.useEchartsData.series[i].data;
            }else if(res.data.useEchartsData.series[i].name=='电费'){
              pYData[1].data[0] = res.data.useEchartsData.series[i].data;
            }else if(res.data.useEchartsData.series[i].name=='碳排量'){
              pYData[1].data[1] = res.data.useEchartsData.series[i].data;
            }
          }
          util.drawMixEChart(echarts, that.data.energyChart, res.data.useEchartsData.xaxisData, pYData, Math.ceil(res.data.useEchartsData.xaxisData.length/8));
        }else if(type=='generPower'){ //发电
					let cYData = [{
						type: 'bar', titles: ['发电量（kWh）'], colors: ['#8676FF'], data: [[]]
					}, {
						type: 'line', titles: ['收益（元）', '碳减排量（吨）'], colors: ['#2CD483', '#F49E4F'], data: [[], []]
					}];
					for(let j=0;j<res.data.generateEchartsData.series.length;j++){
						if(res.data.generateEchartsData.series[j].name=='发电量'){
							cYData[0].data[0] = res.data.generateEchartsData.series[j].data;
						}else if(res.data.generateEchartsData.series[j].name=='收益'){
							cYData[1].data[0] = res.data.generateEchartsData.series[j].data;
						}else if(res.data.generateEchartsData.series[j].name=='碳减量'){
							cYData[1].data[1] = res.data.generateEchartsData.series[j].data;
						}
          }
          util.drawMixEChart(echarts, that.data.energyChart, res.data.generateEchartsData.xaxisData, cYData, Math.ceil(res.data.generateEchartsData.xaxisData.length/8));
        }
      }
    }, function(error) {})
  },
  // 用水统计
  getWaterStatistics(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: this.setTypeTime()
    }
    util.wxRequestPost('/prod-api/powerOverview/getWaterStatistics', "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        if(that.data.energyChart == null){
          that.data.energyChart = that.selectComponent('#energy-chart-bar');
        }
        let xData = [];
        let wYData = [{
          type: 'bar', titles: ['总用水量（m³）'], colors: ['#47B9F9'], data: [[]]
        }, {
          type: 'line', titles: ['总水费（元）'], colors: ['#8675FF'], data: [[]]
        }];
        for(let i=0;i<res.data.powerOverviewVoList.length;i++){
          xData.push(res.data.powerOverviewVoList[i].time);
          wYData[0].data[0].push(res.data.powerOverviewVoList[i].totalValue);
          wYData[1].data[0].push(res.data.powerOverviewVoList[i].previousValue);
        }
        util.drawMixEChart(echarts, that.data.energyChart, xData, wYData, 1);
      }
    }, function(error) {})
  },
  // 用气统计
  getGasStatistics(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: this.setTypeTime()
    }
    util.wxRequestPost('/prod-api/powerOverview/getGasStatistics', "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        if(that.data.energyChart == null){
          that.data.energyChart = that.selectComponent('#energy-chart-bar');
        }
        let xData = [];
        let aYData = [{
          type: 'bar', titles: ['总用燃气量（m³）'], colors: ['#4FC8F4'], data: [[]]
        }, {
          type: 'line', titles: ['总燃气费用（元）'], colors: ['#8675FF'], data: [[]]
        }];
        for(let i=0;i<res.data.powerOverviewVoList.length;i++){
          xData.push(res.data.powerOverviewVoList[i].time);
          aYData[0].data[0].push(res.data.powerOverviewVoList[i].totalValue);
          aYData[1].data[0].push(res.data.powerOverviewVoList[i].previousValue);
        }
        util.drawMixEChart(echarts, that.data.energyChart, xData, aYData, 1);
      }
    }, function(error) {})
  },
  // 根据年月日获取设备用电排行
  getElectricityConsumptionRanking(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: this.setTypeTime()
    }
    util.wxRequestGet('/prod-api/sps/energyConsumptionDistributionRanking/useEnergyConsumptionDistribution', "加载中...", params, 'application/json', function(res) {
      if(res.code==200){
        that.setData({useEnergyData: res.data});
      }
    }, function(error) {})
  },
  onLoad(options) {
    // 初始化条件选择框高度
    let rpxHeight = util.getScreenHeightRpx()-90;
    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，月份要加1，因为从0开始计算
    var yearArr = this.data.yearList;
    for (let i = 0; i < yearArr.list.length; i++) {
      if(year == yearArr.list[i].id){
        yearArr.selected = i;
      }
    }
    var monthArr = util.monthList(month);
    this.setData({
      condtionDialogHeight: rpxHeight,
      monthSelected: month,
      yearList: yearArr,
      monthList: monthArr.slice(0, 6),
      moreMonth: monthArr.slice(6, 12),
    })
    this.requestData();
    this.getElectricityConsumptionRanking();
  },
  setTypeTime(){
    let time = '';
    if(this.data.dateTpye == 'year'){
      time = this.data.yearList.list[this.data.yearList.selected].id;
    }else {
      time = this.data.yearList.list[this.data.yearList.selected].id + '-'+util.formatMD(this.data.monthSelected);
    }
    return time;
  },
  onReady() {
  }
})
