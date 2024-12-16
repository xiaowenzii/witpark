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
    currentDate: {
      y: '',
      m: ''
    },
    dateYear: '',
    dateMonth: '',
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
          that.setData({mEarn: (parseFloat(res.result.totalMoney)/10000).toFixed(3)});
        }else if(type=='y'){
          that.setData({yEarn: (parseFloat(res.result.totalMoney)/10000).toFixed(3)});
        }else{
          that.setData({allEarn: (parseFloat(res.result.totalMoney)/10000).toFixed(3)});
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
  // 获取用电、碳排数据  新增
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
    if(index=='seven'){
      var yearList = this.data.yearList;
      var monthList = this.data.monthList;
      yearList.selected = yearList.list.findIndex(item => item.id === this.data.currentDate.y+'');
      monthList.selected = monthList.list.findIndex(item => item.id === this.data.currentDate.m+'');
      this.setData({
        dateYear: this.data.currentDate.y,
        dateMonth: this.data.currentDate.m,
        yearList: yearList,
        monthList: monthList
      })
    }
    
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
  // 用电、环比用电
  getTotalPowerConsumption(){
    let that = this;
    let params = {
      type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
      time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getTotalPowerConsumption", "加载中...", params, 'application/json', function(res) {
     if(res.data.success){
        var xData = [];
        var data = [];
        var yDataPower = []; //用电
        var yDataPowerL = []; //环比用电
        for (let i = 0; i < res.data.result.length; i++) {
          xData.push(res.data.result[i].time);
          yDataPower.push(res.data.result[i].totalValue);
          yDataPowerL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            data.push(yDataPower);
            data.push(yDataPowerL);
            let barData = {
              type: 'bar', titles: ['用电', '环比用电'],
              data: data
            }
            that.getTotalCarbonEmissions(xData, barData);
          }
        }
      }
    }, function(error) {})
  },
  // 碳排、环比碳排
  getTotalCarbonEmissions(xData, barData){
    let that = this;
    let params = {
      type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
      time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/getTotalCarbonEmissions", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var data = [];
        var yDataCarbon = []; //碳排
        var yDataCarbonL = []; //环比碳排
        for (let i = 0; i < res.data.result.length; i++) {
          yDataCarbon.push(res.data.result[i].totalValue);
          yDataCarbonL.push(res.data.result[i].previousValue);
          if(i==res.data.result.length-1){
            data.push(yDataCarbon);
            data.push(yDataCarbonL);
            let lineData = {
              type: 'line', titles: ['碳排', '环比碳排'],
              data: data
            }
            var yData = [];
            yData.push(barData);
            yData.push(lineData);

            let titles = ['用电', '环比用电', '碳排', '环比碳排'];
            var energyChart = that.selectComponent('#energy-chart');
            let isSevenXData = that.data.dateTpye=='seven'?xData.slice(-7):xData;
            let isSevenYData = yData;
            if(that.data.dateTpye=='seven'){
              isSevenYData[0].data[0] = yData[0].data[0].slice(-7);
              isSevenYData[0].data[1] = yData[0].data[1].slice(-7);
              isSevenYData[1].data[0] = yData[1].data[0].slice(-7);
              isSevenYData[1].data[1] = yData[1].data[1].slice(-7);
            }
            that.drawChart(energyChart, titles, isSevenXData, isSevenYData, that.data.colorList);
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
      type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
      time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
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
      type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
      time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
    }
    util.wxRequestPost("/sps/ParkCarbonAnalysis/geCarbonConsumptionRatio", "加载中...", params, 'application/json', function(res) {
      if(res.data.success){
        var list = elecDataList.proportion;
        for (let i = 0; i < res.data.result.proportion.length; i++) {
          for (let j = 0; j < elecDataList.proportion.length; j++) {
            if(res.data.result.proportion[i].name == elecDataList.proportion[j].name){
              list[j].value = elecDataList.proportion[j].val;
              list[j].coo = res.data.result.proportion[i].val;
            }
          }
          if(i==res.data.result.proportion.length-1){
            that.setData({cakeDataList: list});
            //that.getPowerGenerationComparison();
          }
        }
      }
    }, function(error) {})
  },
  // 发电、环比发电
  // getPowerGenerationComparison(){
  //   let that = this;
  //   let params = {
  //     type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
  //     time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
  //   }
  //   util.wxRequestPost("/sps/ParkCarbonAnalysis/getPowerGenerationComparison", "加载中...", params, 'application/json', function(res) {
  //     if(res.data.success){
  //       var data = [];
  //       var xData = [];
  //       var yDataPower = []; //发电
  //       var yDataPowerL = []; //环比发电
  //       for (let i = 0; i < res.data.result.length; i++) {
  //         xData.push(res.data.result[i].time);
  //         yDataPower.push(res.data.result[i].totalValue);
  //         yDataPowerL.push(res.data.result[i].previousValue);
  //         if(i==res.data.result.length-1){
  //           data.push(yDataPower);
  //           data.push(yDataPowerL);
  //           let barData = {
  //             type: 'bar', titles: ['发电', '环比发电'],
  //             data: data
  //           }
  //           that.getCarbonReductionComparison(xData, barData);
  //         }
  //       }
  //     }
  //   }, function(error) {})
  // },
  // 碳减、环比碳减
  // getCarbonReductionComparison(xData, barData){
  //   let that = this;
  //   let params = {
  //     type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
  //     time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
  //   }
  //   util.wxRequestPost("/sps/ParkCarbonAnalysis/getCarbonReductionComparison", "加载中...", params, 'application/json', function(res) {
  //     if(res.data.success){
  //       var data = [];
  //       var yDataCarbon = []; //碳减
  //       var yDataCarbonL = []; //环比碳减
  //       for (let i = 0; i < res.data.result.length; i++) {
  //         yDataCarbon.push(res.data.result[i].totalValue);
  //         yDataCarbonL.push(res.data.result[i].previousValue);
  //         if(i==res.data.result.length-1){
  //           data.push(yDataCarbon);
  //           data.push(yDataCarbonL);
  //           let lineData = {
  //             type: 'line', titles: ['碳减', '环比碳减'],
  //             data: data
  //           }
  //           var yData = [];
  //           yData.push(barData);
  //           yData.push(lineData);

  //           let energyTitles = ['发电', '环比发电', '碳减', '环比碳减'];
  //           var energyChartGen = that.selectComponent('#energy-chart-gener');
  //           let isSevenXData = that.data.dateTpye=='seven'?xData.slice(-7):xData;
  //           let isSevenYData = yData;
  //           if(that.data.dateTpye=='seven'){
  //             isSevenYData[0].data[0] = yData[0].data[0].slice(-7);
  //             isSevenYData[0].data[1] = yData[0].data[1].slice(-7);
  //             isSevenYData[1].data[0] = yData[1].data[0].slice(-7);
  //             isSevenYData[1].data[1] = yData[1].data[1].slice(-7);
  //           }
  //           that.drawChart(energyChartGen, energyTitles, isSevenXData, isSevenYData, that.data.colorList);
  //           that.getPowerGenerationByDeviceType();
  //         }
  //       }
  //     }
  //   }, function(error) {})
  // },
  // 碳减总量统计(各设备类型发电量)
  // getPowerGenerationByDeviceType(){
  //   let that = this;
  //   let params = {
  //     type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
  //     time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
  //   }
  //   util.wxRequestPost("/sps/ParkCarbonAnalysis/getPowerGenerationByDeviceType", "加载中...", params, 'application/json', function(res) {
  //     if(res.data.success){
  //       var list = res.data.result;
  //       for (let i = 0; i < res.data.result.length; i++) {
  //         list[i].name = res.data.result[i].deviceTypeName;
  //         list[i].value = res.data.result[i].generateElecTotal;
  //         list[i].coo = res.data.result[i].carbonTotal;
  //         if(i==res.data.result.length-1){
  //           that.setData({cakeGenDataList: list});
  //           that.getBenefitTotalStatistic();
  //         }
  //       }
  //     }
  //   }, function(error) {})
  // },
  // 效益总量统计
  // getBenefitTotalStatistic(){
  //   let that = this;
  //   let params = {
  //     type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
  //     time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
  //   }
  //   util.wxRequestPost("/sps/ParkCarbonAnalysis/getBenefitTotalStatistic", "加载中...", params, 'application/json', function(res) {
  //     if(res.data.success){
  //       var xData = [];
  //       var yData = [];
  //       var yDataCarbon = []; //收益
  //       var yDataCarbonL = []; //环比收益
  //       for (let i = 0; i < res.data.result.length; i++) {
  //         xData.push(res.data.result[i].time);
  //         yDataCarbon.push(res.data.result[i].totalValue);
  //         yDataCarbonL.push(res.data.result[i].previousValue);
  //         if(i==res.data.result.length-1){
  //           yData.push(yDataCarbon);
  //           yData.push(yDataCarbonL);
            
  //           var moneyChart = that.selectComponent('#energy-chart-money');
  //           let titles = ['收益', '环比收益'];
  //           let isSevenXData = that.data.dateTpye=='seven'?xData.slice(-7):xData;
  //           let isSevenYData = yData;
  //           if(that.data.dateTpye=='seven'){
  //             isSevenYData[0] = yData[0].slice(-7);
  //             isSevenYData[1] = yData[1].slice(-7);
  //           }
  //           that.drawMoneyChart(moneyChart, titles, that.data.colorList, isSevenXData, isSevenYData);
  //           that.getDeviceTypeRevenue()
  //         }
  //       }
  //     }
  //   }, function(error) {})
  // },
  // 获取各设备类型收益
  // getDeviceTypeRevenue(){
  //   let that = this;
  //   let params = {
  //     type: that.data.dateTpye=='seven'?'m':that.data.dateTpye,
  //     time: that.data.dateTpye=='y'?that.data.dateYear:(that.data.dateYear + '-' + that.data.dateMonth)
  //   }
  //   util.wxRequestPost("/sps/ParkCarbonAnalysis/getDeviceTypeRevenue", "加载中...", params, 'application/json', function(res) {
  //     if(res.data.success){
  //       var list = res.data.result;
  //       for (let i = 0; i < res.data.result.length; i++) {
  //         //{value: 90, name:'屋顶光伏', proportion: "90%"}
  //         list[i].name = res.data.result[i].deviceTypeName;
  //         list[i].value = res.data.result[i].moneyTotal.toFixed(2);
  //         list[i].coo = res.data.result[i].treeTotal.toFixed(2);
  //         if(i==res.data.result.length-1){
  //           that.setData({cakeMoneyDataList: list});
  //         }
  //       }
  //     }
  //   }, function(error) {})
  // },
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
    this.data.dateYear = date.getFullYear();
    this.data.dateMonth = util.formatMD(date.getMonth() + 1);
    this.data.currentDate.y = this.data.dateYear;
    this.data.currentDate.m = this.data.dateMonth;
    this.getDeviceType();
    this.getEarningsRanking('m');
    this.getEarningsRanking('y');
    this.getEarningsRanking('');
    this.getGenerationStatistics();
    this.getComprehensivePowerMiddle();
  },
  // 绘制图形
  drawChart(chartComponnet, titles, xData, yData, color) {
    let option = {};
    let series = [];
    for(let j=0; j<yData.length; j++){
      if(yData[j].type == 'bar'){
        // 绘制柱状图
        for (let i = 0; i < yData[j].data.length; i++) {
          series.push({
            name: yData[j].titles[i],
            type: 'bar',
            label: {
              show: true, position: 'top', formatter: (value, index) => { return value?.value; }
            },
            itemStyle: {
              borderWidth: 1,
              color: { 
                type: 'linear', x: 1, y: 0, x2: 0, y2: 1, 
                colorStops: [{ offset: 1, color: color[i]+'48' }], globalCoord: true 
              },
              borderRadius: [0, 0, 0, 0] //柱状图radius
            },
            label: {
              show: false, //柱状图顶部是否显示数值
              position: 'top',
              formatter: function(params) { if (params.value == 0) { return ''; } else { return params.value; } }
            },
            data: yData[j].data[i]
          })
        }
      } else if(yData[j].type == 'line'){
        for (let i = 0; i < yData[j].data.length; i++) {
          series.push({
            name: yData[j].titles[i],
            data: yData[j].data[i],
            type: "line",
            smooth: false,
            symbol: 'circle',    //将小圆点改成实心 不写symbol默认空心
            symbolSize: 6,       //小圆点的大小
            itemStyle: {color: color[i]},
            lineStyle: {width: yData[j].titles[i].includes("环比")?1:2, color: color[i]}
          })
        }
      }
    }
    option = {
      xAxis: {
        type: 'category',
        axisLabel:{
          function (index, value) {
            console.log(index+ '-'+ value);
            // 总是显示第一个和最后一个标签
            return index === 0 || index === xData.length - 1;
          },
          textStyle: {fontSize: 10}
        },
        axisTick: {
          show: true, inside: true, length: 0,     
          lineStyle: { color: '#FE9800', width: 2, type: 'dotted' }
        },
        data: xData
      },
      yAxis: { type: 'value' },
      tooltip: { trigger: "axis" },
      legend: {data: titles, top: 12},
      series: series,
      grid: { x: 48, x2: 24, y: 48, y2: 24 } //左右上下
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
  drawMoneyChart(chartComponnet, titles, colors, xData, yData) {
    var series =[];
    for (let i = 0; i < yData.length; i++) {
      series.push({
        name: titles[i],
        data: yData[i],
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          normal: {
            lineStyle: {
              width: titles[i].includes("环比")?2:3,//折线宽度
              color: titles[i].includes("环比")?(colors[i]+'48'):colors[i] //折线颜色
            },
            color: colors[i],//拐点颜色
            borderColor: colors[i],//拐点边框颜色
            borderWidth: 2//拐点边框大小
          },
          emphasis: {
            color: '#000000'
          }
        }
      })
    }
    var option = {
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel:{
          function (index, value) { 
            // 总是显示第一个和最后一个标签
            return index === 0 || index === xData.length - 1;
          },
          textStyle: {fontSize: 9}
        }
      },
      yAxis: {
          type: 'value',
          axisLabel:{
            textStyle: {fontSize: 10}
          }
      },
      tooltip: { trigger: "axis" },
      legend: {data: titles, top: 1},
      series: series,
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