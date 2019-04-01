// pages/myCar/drivingRecord/drivingRecord.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var app = getApp();
Page({
  data: {

    cur_month: 0,
    cur_year: 0,
    weeklist: ['日', '一', '二', '三', '四', '五', '六'],
    now_year: '',
    now_month: '',
    now_day: '',
    todayColor: true,
    chooseDay:'',
    drivingRecord: [{"distance":"20km","time":"10h","gl":"10","times":"5"}]
  },


  onLoad: function (options) {
    var cur_year = new Date().getFullYear();   //获取当前年
    var cur_month = new Date().getMonth();    //获取当前月
    var curDay = new Date().getDate();//获取当前日
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month + 1,
      now_year: cur_year,
      now_month: cur_month + 1,
      now_day: curDay,
    });
    this.calendar(cur_year, cur_month + 1);
  },
  //给今天的日期加背景色
  changeDayColor: function () {
    let { cur_month, now_month, cur_year, now_year, todayColor } = this.data
    if (cur_month != now_month || cur_year != now_year) {
      this.setData({
        todayColor: false,
        chooseDay:"1",
      })
    } else {
      this.setData({
        todayColor: true,
        chooseDay: "1",
      })
    }
  },
  /*
   用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '简单日历实现小程序版本',
      desc: '简单日历实现小程序版本',
      path: '/pages/index/index'
    };
  },

  calendar: function (year, month) {
    var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /**
     * 本月天数
     */
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
      days[1] = 29;
    }

    var day = days[month - 1];

    /**
     * 本月第一天星期几
     */
    var myDate = new Date(year, month - 1, 1);
    var weektime = myDate.getDay();

    /**
     * 上个月的天数
     */
    if (month == 1) {
      var prevyear = year - 1;
      var prevmonth = 12;
      var prevday = 31;
    } else {
      prevmonth = month - 1;
      prevday = days[prevmonth - 1];
    }

    /**
     * 下个月的天数
     */
    if (month == 12) {
      var nextyear = year + 1;
      var nextmonth = 1;
      var nextday = 31;
    } else {
      nextmonth = month + 1;
      nextday = days[nextmonth - 1];
    }

    /**
     * 日历上第一个数字
     */
    if (weektime == 0) {
      var firstnumber = 1;
    } else {
      firstnumber = prevday - weektime + 1;
    }

    /**
     * 日历上最后一个数字
     */
    if (firstnumber == 1) {
      var lastnumber = 7 - (day % 7);
    } else {
      if ((prevday - firstnumber + 1 + day) % 7 == 0) {
        lastnumber = day;
      } else {
        var remainder = (prevday - firstnumber + 1 + day) % 7;
        lastnumber = 7 - remainder;
      }
    }

    var lastMonthDaysList = [];
    var currentMonthDaysList = [];
    var nextMonthDaysList = [];

    if (firstnumber == 1) {
      lastMonthDaysList = [];
    } else {
      for (var i = firstnumber; i <= prevday; i++) {
        lastMonthDaysList.push(i);
      }
    }

    for (var i = 1; i <= day; i++) {
      currentMonthDaysList.push(i);
    }

    if (lastnumber == day) {
      nextMonthDaysList = [];
    } else {
      for (var i = 1; i <= lastnumber; i++) {
        nextMonthDaysList.push(i);
      }
    }

    this.setData({
      lastMonthDaysList: lastMonthDaysList,
      currentMonthDaysList: currentMonthDaysList,
      nextMonthDaysList: nextMonthDaysList
    })
  },

  reduceMonth: function (e) {
    var cur_year = this.data.cur_year;

    if (this.data.cur_month == 1) {
      var cur_month = 12;
      cur_year = cur_year - 1;
    } else {
      cur_month = this.data.cur_month - 1;
    }

    this.setData({
      cur_year: cur_year,
      cur_month: cur_month
    });

    //console.log('cur_year', cur_year);
    //console.log('cur_month', cur_month);

    this.calendar(cur_year, cur_month);
    this.changeDayColor();
  },
  addMonth: function (e) {
    var cur_year = this.data.cur_year;

    if (this.data.cur_month == 12) {
      var cur_month = 1;
      cur_year = cur_year + 1;
    } else {
      cur_month = this.data.cur_month + 1;
    }

    this.setData({
      cur_year: cur_year,
      cur_month: cur_month
    });

    //console.log('cur_year', cur_year);
    //console.log('cur_month', cur_month);

    this.calendar(cur_year, cur_month);
    this.changeDayColor();
  },
  findToday: function () {
    this.setData({
      cur_year: this.data.now_year,
      cur_month: this.data.now_month,
      todayColor: true
    })
    this.calendar(this.data.now_year, this.data.now_month);
  },
  addYear: function (e) {
    var cur_year = this.data.cur_year + 1;
    var cur_month = this.data.cur_month;

    this.setData({
      cur_year: cur_year,
      cur_month: cur_month
    })

    this.calendar(cur_year, cur_month);
    this.changeDayColor();
  },
  reduceYear: function (e) {
    var cur_year = this.data.cur_year - 1;
    var cur_month = this.data.cur_month;

    this.setData({
      cur_year: cur_year,
      cur_month: cur_month
    })

    this.calendar(cur_year, cur_month);
    this.changeDayColor();
  },
  chooseDay: function (e) {
    const { day } = e.currentTarget.dataset;
    this.setData({
      chooseDay:day,
    })
    console.log(day)
  }

})
