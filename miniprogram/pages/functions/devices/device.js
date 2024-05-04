import * as echarts from '../../component/ec-canvas/echarts'

Page({
  data: {
    moreMonth:[1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
    showMoreMonth: false,
    scrollWidth: '100%',
    selected: 0,
    deviceList:[{
      id: '1',
      desc: '13-1-1001-13',
      address: '旧楼1#号楼 1层',
      state: 0
    },{
      id: '2',
      desc: '13-1-1001-13',
      address: '旧楼1#号楼 1层',
      state: 1
    },{
      id: '2',
      desc: '13-1-1001-13',
      address: '旧楼1#号楼 1层',
      state: 1
    },{
      id: '2',
      desc: '13-1-1001-13',
      address: '旧楼1#号楼 1层',
      state: 0
    },{
      id: '2',
      desc: '13-1-1001-13',
      address: '旧楼1#号楼 1层',
      state: 1
    }],
    deviceChart: {
      lazyLoad: true
    }
  },
  showMonth(){
    var showMoreMonth = !this.data.showMoreMonth;
    this.setData({
      showMoreMonth: showMoreMonth
    })
  },
  selectMonthItem(res){
    var index = res.currentTarget.dataset.index;
    this.setData({
      showMoreMonth: false
    })
    console.log(this.data.moreMonth[index]);
  },
  selecteDevice(res){
    var index = res.currentTarget.dataset.index
    this.setData({
      selected: index
    })
  },
  switchState(res){
    console.log(res.currentTarget.dataset.item);
  },
  onShow() {
    wx.getSystemInfo({
      success: (res)  => {
        var scrollWidth = res.windowWidth * (750 / res.windowWidth) - 48;
        this.setData({
          scrollWidth: scrollWidth+"rpx"
        })
      },fail: console.error,
    });
  },
  onReady() {
    var deviceChart = this.selectComponent('#device-chart');
    let dataList = [
      {value: 21, name: '正常设备'},
      {value: 4, name: '未运行设备'},
      {value: 1, name: '异常设备'}
    ]
    this.drawChart(deviceChart, dataList)
  },
  //绘制环形图
  drawChart(chartComponnet, dataList) {
    let colorList = ['#1CB7A3','#DCDCDC','#FFA63D']
    var option = {
      series: [{
        type:'pie',
        radius: ['80%', '90%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color:'#4c4a4a',
            formatter: '{total|' + 26 +'}'+ '\n\r' + '{active|设备总数}',
            rich: {
              total:{
                fontSize: 24,
                fontFamily : "微软雅黑",
                fontWeight: "bolder",
                color:'#454c5c'
              },
              active: {
                fontFamily : "微软雅黑",
                fontSize: 14,
                color:'#6c7a89',
                lineHeight:30,
              },
            }
          },
          emphasis: {
            show: true,//中间文字显示
          }
        },
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
    const getPixelRatio = () => {
      let pixelRatio = 0
      wx.getSystemInfo({
        success: function (res) {
          pixelRatio = res.pixelRatio
        },
        fail: function () {
          pixelRatio = 0
        }
      })
      return pixelRatio
    }
    var dpr = getPixelRatio()
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