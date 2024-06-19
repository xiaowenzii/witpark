import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    dateTpye: 'm',
    monthList: [],
    moreMonth:[],
    monthSelected: 1, // 选择的月份
    condtionDialogHeight: 0,
    searchDataList:{},
    // 用能类型
    yearList: {
      "type": 2,
      "selected": "0",
      "list": [{"id": "2023","name": "2023（年）"}, {"id": "2024","name": "2024（年）"}, {"id": "2025","name": "2025（年）"}, {"id": "2026","name": "2026（年）"}]
    },
    energyList: ['用电', '发电', '用气', '用水', '储能', '碳减', '充电桩收益'],
    energyType: 0,//能耗类型
    showSearchDialog: false,
    showMoreMonth: false,
    ec: {
      lazyLoad: true
    },
    proList: [],
    proListVal: 0,
    powerData: {}
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
  // 获取各种统计数据
  getData(type, url){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateTpye == 'y'?that.data.yearList.list[that.data.yearList.selected].id:that.data.yearList.list[that.data.yearList.selected].id + '-'+util.formatMD(that.data.monthSelected)
    }
    util.wxRequestPost(url, "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var energyChart = that.selectComponent('#energy-chart-bar');
        var xData = [];
        var yData = [];
        that.setData({powerData: res.data.result});
        for (let i = 0; i < res.data.result.powerOverviewVoList.length; i++) {
          if(that.data.dateTpye == 'y'){
            xData.push(parseInt(res.data.result.powerOverviewVoList[i].time.split('-')[1]));
          }else{
            xData.push(parseInt(res.data.result.powerOverviewVoList[i].time.split('-')[2]));
          }
          yData.push(res.data.result.powerOverviewVoList[i].totalValue);
        }
        that.drawChart(energyChart, xData, yData)
      }
    }, function(error) {})
  },
  //获取用水统计
  getWaterStatistics(){
    let that = this;
    let params = {
      type: 'm',
      time: that.data.yearList.list[that.data.yearList.selected].id + '-'+util.formatMD(that.data.monthSelected)
    }
    util.wxRequestPost('/sps/app/powerOverview/getWaterStatistics', "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var energyChart = that.selectComponent('#energy-chart-bar');
        var xData = [];
        var yData = [];
        that.setData({powerData: res.data.result});
        for (let i = 0; i < res.data.result.powerOverviewVoList.length; i++) {
          xData.push(parseInt(res.data.result.powerOverviewVoList[i].time.split('-')[1]) + '月');
          yData.push(res.data.result.powerOverviewVoList[i].totalValue);
        }
        that.drawChart(energyChart, xData, yData)
      }
    }, function(error) {})
  },
  //获取用气统计
  getGasStatistics(){
    let that = this;
    let params = {
      type: 'm',
      time: that.data.yearList.list[that.data.yearList.selected].id + '-'+util.formatMD(that.data.monthSelected)
    }
    util.wxRequestPost('/sps/app/powerOverview/getGasStatistics', "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var energyChart = that.selectComponent('#energy-chart-bar');
        var xData = [];
        var yData = [];
        that.setData({powerData: res.data.result});
        for (let i = 0; i < res.data.result.powerOverviewVoList.length; i++) {
          xData.push(parseInt(res.data.result.powerOverviewVoList[i].time.split('-')[1]) + '月');
          yData.push(res.data.result.powerOverviewVoList[i].totalValue);
        }
        that.drawChart(energyChart, xData, yData)
      }
    }, function(error) {})
  },
  // 请求集中
  requestData(){
    switch (this.data.energyList[this.data.energyType]) {
      case '用电':
        this.getData('getElectricityStatistics', '/sps/app/powerOverview/getElectricityStatistics'); //获取用电统计
        break;
      case '发电':
        this.getData('getGenerationStatistics', '/sps/app/powerOverview/getGenerationStatistics'); //获取发电统计
        break;
      case '用气':
        this.getGasStatistics();//获取用气统计
        break;
      case '用水':
        this.getWaterStatistics()//获取用水统计
        break;
      case '储能':
        this.getData('getEnergyStorageStatistics', '//sps/app/powerOverview/getEnergyStorageStatistics'); //获取储能统计
        break;
      case '碳减':
        this.getData('getCarbonReductionStatistics', '/sps/app/powerOverview/getCarbonReductionStatistics'); //获取减碳统计
        break;
      case '充电桩收益':
        this.getData('getIncomeStatistics', '/sps/app/powerOverview/getIncomeStatistics'); //获取充电桩收益统计
        break;
    }
  },
  // 根据年月日获取设备用电排行
  getElectricityConsumptionRanking(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateTpye == 'y'?that.data.yearList.list[that.data.yearList.selected].id:that.data.yearList.list[that.data.yearList.selected].id + '-'+util.formatMD(that.data.monthSelected)
    }
    util.wxRequestPost('/sps/app/PowerAnalysis/getElectricityConsumptionRanking', "加载中...", params, 'application/json', function(res) {
      console.log(res);
      if(res.data.success){
        var allVal = 0;
        for (let i = 0; i < res.data.result.length; i++) {
          allVal = allVal + parseFloat(res.data.result[i].val);
        }
        that.setData({proList: res.data.result, proListVal: allVal});
        console.log('根据年月日获取设备用电排行,月总用电：'+allVal);
        console.log(that.data.proList);
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
  onReady() {
  },
  // 绘制柱状图
  drawChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval: 1,
          textStyle: {
            fontSize: 10
          }
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
        x: 48,  //距离左边
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
