Component({
  properties: {
    year: String,
    month: String,
    day: String,
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
          date: i.toString()
        });
      }
      // 补全前面 (因为一周七天，如果第一天是星期三，则需要把星期一和星期二数据补全)
      for (let i = 0; i < firstDayWeek; i++) {
        days.unshift({
          date: ''
        });
      }
      // 补全后面 (因为一周七天，如果最后一天是星期五，则需要把星期六和星期天数据补全)
      for (let i = lastDayWeek; i <= 7; i++) {
        days.push({
          date: ''
        });
      }
      this.setData({daysArray: days});
    },
    // 点击单个日期事件
    clickItem (event) {
      let date = event.currentTarget.dataset.date;
      if (date) {
        this.setData({D: date});
      }
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
        Y: this.data.Y,
        M: this.data.M,
        D: this.data.D
      }
      var myEventOption = {}
      this.triggerEvent('myevent', msg, myEventOption);
    }
  },
  attached: function() {
    let Y = this.properties.year;
    let M = this.properties.month;
    let D = this.properties.day;
    this.getCurrentDaysAndWeekStart(Y, M, D);
  }
})