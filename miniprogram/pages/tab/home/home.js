import * as echarts from '../../component/ec-canvas/echarts'
import * as util from "../../../utils/util"

Page({
  data: {
    userInfo: {},
    airStationType: '',
    airStationBasicId: '',
    weatherInfo:{},
    todayDate: '',
    yEarn: 0,
    mEarn:0,
    allEarn: 0,
    allUsepower: 0,
    allCreatePower: 0,
    dateTpye: 'm',
    dateYear: '2024',
    dateMonth: '07',
    ec: {
      lazyLoad: true
    },
    elecCarbonEmission: {},
    elecCarbonReduction: {},
    colorList: ['#1CB7A3','#7A64FF','#FFA63D', '#57AD0A','#B1C7FF','#0B2186','#55D86B','#1CB7A3','#7A64FF','#FFA63D', '#57AD0A','#B1C7FF','#0B2186'],
    cakeDataList: [],
    cakeGenDataList: [],
    cakeMoneyDataList: [],
    yearList: {
      "selected": "0",
      "list": [{"id": "2023","name": "2023年"}, {"id": "2024","name": "2024年"}, {"id": "2025","name": "2025年"}, {"id": "2026","name": "2026年"}]
    },
    monthList: {
      "selected": "0",
      "list": [{"id": "01","name": "1月"}, {"id": "02","name": "2月"}, {"id": "03","name": "3月"}, {"id": "04","name": "4月"}, {"id": "05","name": "5月"}, {"id": "06","name": "6月"}, {"id": "07","name": "7月"}, {"id": "08","name": "8月"}, {"id": "09","name": "9月"}, {"id": "10","name": "10月"}, {"id": "11","name": "11月"}, {"id": "12","name": "12月"}]
    }
  },
  selectShowY: false,
  selectShowM: false,
  // 获取设备类型
  getDeviceType(){
    let that = this;
    util.wxRequestGet("/sps/app/device/listDeviceType", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(res.result != null && res.result.length>0){
          for (var i = 0; i < res.result.length; i++) {
            if(res.result[i].deviceTypeName == "小型气象站"){
              that.setData({airStationType: res.result[i].deviceTypeId});
              that.getDeviceDataList();
            }
          }
        }
      }
    }, function() {})
  },
  // 获取单个设备列表
  getDeviceDataList(){
    let that = this;
    let params = {
      deviceTypeId: this.data.airStationType
    }
    util.wxRequestPost("/sps/app/device/listDeviceBasic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        that.setData({airStationBasicId: res.data.result[0].deviceBasicId});
        that.getLatestData();
      }
    }, function(error) {})
  },
  // 获取气象站最新实时数据
  getLatestData(){
    let that = this;
    let params = {
      deviceTypeId: that.data.airStationType,
      deviceBasicId: that.data.airStationBasicId
    }
    util.wxRequestPost("/sps/app/device/gas/getLatestData", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.data.success){
        that.setData({weatherInfo: res.data.result});
        wx.setStorageSync('weatherInfo', res.data.result);
      }
    }, function(error) {})
  },
  // 获取年收益、月收益、总收益
  getEarningsRanking(type){
    let that = this;
    var params ={type: type};
    util.wxRequestGet("/sps/bigscreen1/getEarningsRanking", "加载中...", params, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        if(type=='m'){
          that.setData({mEarn: parseFloat(res.result.totalMoney).toFixed(2)});
        }else if(type=='y'){
          that.setData({yEarn: parseFloat(res.result.totalMoney).toFixed(2)});
        }else{
          that.setData({allEarn: parseFloat(res.result.totalMoney).toFixed(2)});
        }
      }
    }, function(error) {})
  },
  // 获取总发电量
  getGenerationStatistics(){
    let that = this;
    util.wxRequestGet("/sps/bigscreen3/getGenerationStatistics", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        var power = 0;
        for (let i = 0; i < res.result.powerOverviewVoList.length; i++) {
          power = power+parseFloat(res.result.powerOverviewVoList[i].totalValue);
          if(i==res.result.powerOverviewVoList.length-1){
            that.setData({allCreatePower: power.toFixed(2)});
          }
        }
      }
    }, function(error) {})
  },
  // 获取总用电量
  getComprehensivePowerMiddle(){
    let that = this;
    util.wxRequestGet("/sps/PowerAnalysis/getComprehensivePowerMiddle", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({allUsepower: res.result.packSumPower});

        that.getCarbonEmissionsOverviewVO();
      }
    }, function(error) {})
  },
  // 获取用电、碳排数据
  getCarbonEmissionsOverviewVO(){
    let that = this;
    util.wxRequestGet("/sps/ParkCarbonAnalysis/getCarbonEmissionsOverviewVO", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({elecCarbonEmission: res.result});
        that.getCarbonReductionOverview();
      }
    }, function(error) {})
  },
  // 获取发电、碳减数据
  getCarbonReductionOverview(){
    let that = this;
    util.wxRequestGet("/sps/ParkCarbonAnalysis/getCarbonReductionOverview", "加载中...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.success){
        that.setData({elecCarbonReduction: res.result});
        that.getTotalPowerConsumption();
      }
    }, function(error) {})
  },
  // 选择时间类别，年或者月
  selectDateType(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      dateTpye: index
    })
    this.getTotalPowerConsumption();
  },
  // 点击下拉显示框
  selectTap(e) {
    let item = e.currentTarget.dataset.item;
    if(item=='y'){
      this.setData({
        selectShowY: !this.data.selectShowY,
        selectShowM: false
      });
    }else{
      this.setData({
        selectShowY: false,
        selectShowM: !this.data.selectShowM
      });
    }
  },
  // 点击下拉选择年份
  selectY(e) {
    let index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    var yearList = this.data.yearList;
    yearList.selected = index;
    this.setData({
      selectShowY: !this.data.selectShowY,
      yearList: yearList,
      dateYear: yearList.list[index].id
    });
    this.getTotalPowerConsumption();
  },
  // 点击下拉选择月份
  selectM(e) {
    let index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    var monthList = this.data.monthList;
    monthList.selected = index;
    this.setData({
      selectShowM: !this.data.selectShowM,
      monthList: monthList,
      dateMonth: monthList.list[index].id
    });
    this.getTotalPowerConsumption();
  },
  // 用电、同期环比用电
  getTotalPowerConsumption(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    console.log(params)
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getTotalPowerConsumption", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var xData = [];
        var yData = [];
        var yDataPower = []; //用电
        var yDataPowerL = []; //同期环比用电
        for (let i = 0; i < res.data.result.length; i++) {
          xData.push(res.data.result[i].time);
          yDataPower.push(res.data.result[i].totalValue);
          yDataPowerL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            yData.push(yDataPower);
            yData.push(yDataPowerL);
            that.getTotalCarbonEmissions(xData, yData);
          }
        }
      }
    }, function(error) {})
  },
  // 碳排、同期环比碳排
  getTotalCarbonEmissions(xData, yData){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getTotalCarbonEmissions", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var yDataCarbon = []; //碳排
        var yDataCarbonL = []; //同期环比碳排
        for (let i = 0; i < res.data.result.length; i++) {
          yDataCarbon.push(res.data.result[i].totalValue);
          yDataCarbonL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            yData.push(yDataCarbon);
            yData.push(yDataCarbonL);
            // var yData = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            //     [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],
            //     [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],
            //     [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34]];

            var energyChart = that.selectComponent('#energy-chart');
            that.drawChart(energyChart, xData, yData);
            that.getElectricityConsumptionRatio();
          }
        }
      }
    }, function(error) {})
  },
  // 根据年月日获取设备能耗占比
  getElectricityConsumptionRatio(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getElectricityConsumptionRatio", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        that.geCarbonConsumptionRatio(res.data.result);
      }
    }, function(error) {})
  },
  // 根据年月日获取设备碳排占比
  geCarbonConsumptionRatio(elecDataList){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/geCarbonConsumptionRatio", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var list = elecDataList;
        for (let i = 0; i < res.data.result.length; i++) {
          for (let j = 0; j < elecDataList.length; j++) {
            if(res.data.result[i].name == elecDataList[j].name){
              //{value: 10, name:'空调', coo: 1, proportion: "7.7%"}
              list[j].value = elecDataList[j].val;
              list[j].coo = res.data.result[i].val;
              break;
            }
          }
          if(i==res.data.result.length-1){
            that.setData({cakeDataList: list});
            // 用电，碳排，百分比
            var energyCakeChart = this.selectComponent('#energy-cake');
            that.drawCakeChart(energyCakeChart, this.data.cakeDataList);
            that.getPowerGenerationComparison();
          }
        }
      }
    }, function(error) {})
  },
  // 发电、同期环比发电
  getPowerGenerationComparison(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getPowerGenerationComparison", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var xData = [];
        var yData = [];
        var yDataPower = []; //发电
        var yDataPowerL = []; //同期环比发电
        for (let i = 0; i < res.data.result.length; i++) {
          xData.push(res.data.result[i].time);
          yDataPower.push(res.data.result[i].totalValue);
          yDataPowerL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            yData.push(yDataPower);
            yData.push(yDataPowerL);

            that.getCarbonReductionComparison(xData, yData);
          }
        }
      }
    }, function(error) {})
  },
  // 碳减、同期环比碳减
  getCarbonReductionComparison(xData, yData){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getCarbonReductionComparison", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var yDataCarbon = []; //碳减
        var yDataCarbonL = []; //同期环比碳减
        for (let i = 0; i < res.data.result.length; i++) {
          yDataCarbon.push(res.data.result[i].totalValue);
          yDataCarbonL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            yData.push(yDataCarbon);
            yData.push(yDataCarbonL);
            
            var energyChartGen = this.selectComponent('#energy-chart-gener');
            that.drawChart(energyChartGen, xData, yData);

            that.getPowerGenerationByDeviceType();
          }
        }
      }
    }, function(error) {})
  },
  // 碳减总量统计(各设备类型发电量)
  getPowerGenerationByDeviceType(xData, yData){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getPowerGenerationByDeviceType", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var list = res.data.result;
        for (let i = 0; i < res.data.result.length; i++) {
          //{value: 90, name:'屋顶光伏', coo: 9, proportion: "90%"}
          list[i].name = res.data.result.deviceTypeName;
          list[i].value = res.data.result.generateElecTotal;
          list[i].coo = res.data.result.carbonTotal;
          if(i==res.data.result.length-1){
            that.setData({cakeGenDataList: list});
            var energyGenCakeChart = this.selectComponent('#energy-gen-cake');
            that.drawCakeChart(energyGenCakeChart, this.data.cakeGenDataList);

            that.getBenefitTotalStatistic();
          }
        }
      }
    }, function(error) {})
  },
  // 效益总量统计
  getBenefitTotalStatistic(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getBenefitTotalstatistic", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var xData = [];
        var yData = [];
        var yDataCarbon = []; //效益
        var yDataCarbonL = []; //同期环比效益
        for (let i = 0; i < res.data.result.length; i++) {
          yDataCarbon.push(res.data.result[i].totalValue);
          yDataCarbonL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            yData.push(yDataCarbon);
            yData.push(yDataCarbonL);
            
            var moneyChart = this.selectComponent('#energy-chart-money');
            // var yDataMoney = [[4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
            // [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]];
            that.drawMoneyChart(moneyChart, xData, yData);

            that.getDeviceTypeRevenue()
          }
        }
      }
    }, function(error) {})
  },
  // 获取各设备类型收益
  getDeviceTypeRevenue(){
    let that = this;
    let params = {
      type: that.data.dateTpye,
      time: that.data.dateYear + '-' + that.data.dateMonth
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getDeviceTypeRevenue", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        for (let i = 0; i < res.data.result.length; i++) {
          //{value: 90, name:'屋顶光伏', proportion: "90%"}
          list[i].name = res.data.result.deviceTypeName;
          list[i].value = res.data.result.moneyTotal;
          list[i].coo = res.data.result.treeTotal;
          if(i==res.data.result.length-1){
            that.setData({cakeMoneyDataList: list});
            var energyMoneyCakeChart = this.selectComponent('#energy-money-cake');
            that.drawCakeChart(energyMoneyCakeChart, this.data.cakeMoneyDataList);
          }
        }
      }
    }, function(error) {})
  },
  onLoad(options) {
    this.setData({userInfo: wx.getStorageSync('userInfo')});

    // 获取当前日期
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const month = date.getMonth() + 1; // 获取当前月份，月份要加1，因为从0开始计算
    var yearArr = this.data.yearList;
    var monthArr = this.data.monthList;
    for (let i = 0; i < yearArr.list.length; i++) {
      if(year == yearArr.list[i].id){
        yearArr.selected = i;
      }
    }
    monthArr.selected = month-1;
    
    this.setData({
      yearList: yearArr,
      monthList: monthArr
    })
  },
  onReady(){
    // 获取当前日期
    const date = new Date();
    this.setData({
      todayDate: date.getFullYear() + '.' + util.formatMD(date.getMonth() + 1) + '.' + util.formatMD(date.getDate())
    })
    // this.getDeviceType();
    // this.getEarningsRanking('m');
    // this.getEarningsRanking('y');
    // this.getEarningsRanking('');
    // this.getGenerationStatistics();
    // this.getComprehensivePowerMiddle();
  },
  // 绘制图形
  drawChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval: 1,
          textStyle: {fontSize: 10}
        }
      },
      yAxis: {
          type: 'value',
          axisLabel:{
            textStyle: {fontSize: 10}
          }
      },
      series: [{
        type: 'bar',
        label:{show: true, position: 'top', formatter: (value,index)=> { return value?.value;}},
        itemStyle: {
          normal: {
            borderWidth: 1,
            color: { type: 'linear', x: 1, y: 0, x2: 0,  y2: 1,colorStops: [{offset: 1,color: '#18B6A2'}],globalCoord: true},
            barBorderRadius: [0, 0, 0, 0], //柱状图radius
            label: {
              show: false, //柱状图顶部是否显示数值
              position: 'top',
              textStyle: {color: '#222222'},
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
        data: yData[0]
      },{
        type: 'bar',
        label:{show: true, position: 'top',formatter: (value,index)=> {return value?.value;}},
        itemStyle: {
          normal: {
            borderWidth: 1,
            color: { type: 'linear',colorStops: [{offset: 1,color: '#FFA63D'}],globalCoord: true},
            barBorderRadius: [0, 0, 0, 0], //柱状图radius
            label: {
              show: false, //柱状图顶部是否显示数值
              position: 'top',
              textStyle: {color: '#222222'},
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
        data: yData[1]
      },{
        name: '碳排',
        data: yData[2],
        type: 'line',
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1,//折线宽度
              color: "#FFA63D"//折线颜色
            },
            color: '#FFA63D',//拐点颜色
            borderColor: '#000000',//拐点边框颜色
            borderWidth: 0.5//拐点边框大小
          },
          emphasis: {
            color: '#000000'
          }
        }
      },{
        name: '碳减',
        data: yData[3],
        type: 'line',
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 2,//折线宽度
              color: "#18B6A2"//折线颜色
            },
            color: '#18B6A2',//拐点颜色
            borderColor: '#000000',//拐点边框颜色
            borderWidth: 0.5//拐点边框大小
          },
          emphasis: {
            color: '#000000'
          }
        }
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
  },
  // 绘制圆饼图
  drawCakeChart(chartComponnet, dataList){
    let colorList = this.data.colorList;
    var option = {
      series: [{
        type: 'pie',
        radius: ['0%','80%'],
        color: colorList,
        data: dataList.map((item, index) => {
          item.label = {
            color: colorList[index],
            color: 'inherit'
          }
          return item
        })
      }]
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
  },
  // 绘制收益折线图
  drawMoneyChart(chartComponnet, xData, yData) {
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          interval: 1,
          textStyle: {fontSize: 10}
        }
      },
      yAxis: {
          type: 'value',
          axisLabel:{
            textStyle: {fontSize: 10}
          }
      },
      series: [{
        name: '收益',
        data: yData[0],
        type: 'line',
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 2,//折线宽度
              color: "#18B6A2"//折线颜色
            },
            color: '#18B6A2',//拐点颜色
            borderColor: '#000000',//拐点边框颜色
            borderWidth: 0.5//拐点边框大小
          },
          emphasis: {
            color: '#000000'
          }
        }
      },{
        name: '同期环比收益',
        data: yData[1],
        type: 'line',
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 2,//折线宽度
              color: "#FFA63D"//折线颜色
            },
            color: '#FFA63D',//拐点颜色
            borderColor: '#000000',//拐点边框颜色
            borderWidth: 0.5//拐点边框大小
          },
          emphasis: {
            color: '#000000'
          }
        }
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
  },
})