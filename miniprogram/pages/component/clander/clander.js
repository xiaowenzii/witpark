import {formatTime} from "../../../utils/util"

Component({
  properties: {
    startT: String,
    endT: String,
    isDataChange: {
      type: Boolean,
      value: false,
      observer () {
        this.triggerEvent('formatter', this.data.daysArray);
      }
    },
    daysData: {
      type: Array,
      observer (newVal) {
        if (newVal.length > 0) {
          this.setData({ daysArray: newVal });
        }
      }
    }
  },
  data: {
    Y: '', // 年
    M: '', // 月
    D: '', // 日
    W: '', // 星期
    startTime:'',
    endTime:'',
    isSelectFirst: false,
    firstDayWeek: '', // 当前月第一天星期几
    lastDayWeek: '',  // 当前月最后一天星期几
    daysCount: 0,  // 总天数
    daysArray: [] // 日历中天数数组
  },
  methods: {
    // 获取当前月的天数，以及当前月第一天是星期几，最后一天是星期几
    getCurrentDaysAndWeekStart (year, month, day) {
      let daysCount = new Date(year, month, 0).getDate(); // 当前月最后一天日期，即当前月的天数
      let firstDayWeek = new Date(year, month - 1, 1).getDay(); // 第一天星期几
      let lastDayWeek = new Date(year, month, 0).getDay(); // 最后一天星期几
      this.setData({
        Y: year,
        M: month,
        D: day,
        firstDayWeek: firstDayWeek,
        lastDayWeek: lastDayWeek,
        daysCount: daysCount
      });
      this.renderDate();
    },
    // 根据总天数和第一天星期几，最后一天星期几，渲染日历天数数组
    renderDate () {
      let firstDayWeek = this.data.firstDayWeek;
      let lastDayWeek = this.data.lastDayWeek;
      let daysCount = this.data.daysCount;
      let days = []; // 当前月总天数数组
      for (let i = 1; i <= daysCount; i++) {
        days.push({
          date: i.toString(),
          selected: false
        });
      }
      // 补全前面 (因为一周七天，如果第一天是星期三，则需要把星期一和星期二数据补全)
      for (let i = 0; i < firstDayWeek; i++) {
        days.unshift({
          date: '',
          selected: false
        });
      }
      // 补全后面 (因为一周七天，如果最后一天是星期五，则需要把星期六和星期天数据补全)
      for (let i = lastDayWeek; i <= 7; i++) {
        days.push({
          date: '',
          selected: false
        });
      }
      this.setData({daysArray: days});
      this.clanderStyle();
    },
    // 点击单个日期事件
    clickItem (event) {
      let date = event.currentTarget.dataset.date;
      if (date) {
        this.setData({D: date});
        let time = formatTime(this.data.Y + "-" + this.data.M + "-" + date);
        if(this.data.isSelectFirst){
          let firstSelect = this.data.startTime;
          let firstSelectSpl = firstSelect.split("-");
          // 两次选择的时间比较
          if(parseInt(this.data.Y + this.formatMD(this.data.M) + this.formatMD(date) +'') > parseInt(firstSelectSpl[0] + firstSelectSpl[1] + firstSelectSpl[2] +'')){
            this.setData({endTime: time, isSelectFirst:false});
          }else{
            this.setData({startTime: time, endTime: firstSelect, isSelectFirst:false});
          }
        } else{
          this.setData({startTime: time, endTime: '', isSelectFirst:true});
        }
        this.clanderStyle();
      }
    },
    // 选中的时间段增加背景颜色
    clanderStyle(){
      let days = this.data.daysArray;
      if(this.data.startTime!=''){
        let ymdS = this.data.startTime.split("-");
        let ymdSInt = parseInt(ymdS[0] + this.formatMD(ymdS[1]) + this.formatMD(ymdS[2]) + '');
        if(this.data.endTime!='' && this.data.endTime!=this.data.startTime){
          let ymdE = this.data.endTime.split("-");
          let ymdEInt = parseInt(ymdE[0] + this.formatMD(ymdE[1]) + this.formatMD(ymdE[2]) + '');
          
          for (let i = 0; i < days.length; i++) {
            if(days[i].date!=''){
              let clanderItem = parseInt(this.data.Y + this.formatMD(this.data.M) + this.formatMD(days[i].date) + '');
              if((ymdSInt<clanderItem && ymdEInt>clanderItem) || ymdSInt==clanderItem || ymdEInt==clanderItem){
                days[i].selected = true;
              }else{
                days[i].selected = false;
              }
            }
          }
        }else{
          if(ymdS[0] == this.data.Y && parseInt(ymdS[1]) == this.data.M){
            for (let i = 0; i < days.length; i++) {
              if(parseInt(ymdS[2])==days[i].date){
                days[i].selected = true;
              }else{
                days[i].selected = false;
              }
            }
          }
        }
      }
      this.setData({daysArray: days});
    },
    // 月份减
    monthReduce(){
      var year = this.data.Y;
      var month = this.data.M;
      if(month==1){
        year = year - 1;
        month = 12;
      }else{
        month = month - 1;
      }
      this.getCurrentDaysAndWeekStart(year, month, this.data.D);
    },
    // 月份加
    monthAdd(){
      var year = this.data.Y;
      var month = this.data.M;
      if(month==12){
        year = parseInt(year) + 1;
        month = 1;
      } else {
        month = parseInt(month) + 1;
      }
      this.getCurrentDaysAndWeekStart(year, month, this.data.D);
    },
    close(res){
      var msg = {
        startTime: this.data.startTime,
        endTime: this.data.endTime
      }
      var myEventOption = {}
      this.triggerEvent('myevent', msg, myEventOption);
    },
    // 月份和日数补充至两位
    formatMD(dateNum){
      if(parseInt(dateNum)>9){
        return parseInt(dateNum);
      }else{
        return '0' + parseInt(dateNum);
      }
    }
  },
  attached: function() {
    let start = this.properties.startT;
    let end = this.properties.endT;
    let ymd = start.split("-");
    this.setData({
      startTime:start,
      endTime: end
    })
    this.getCurrentDaysAndWeekStart(ymd[0], parseInt(ymd[1]), parseInt(ymd[2]));
  }
})