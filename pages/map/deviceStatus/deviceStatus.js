// pages/map/deviceStatus/deviceStatus.js

import {
  http
} from '../../../utils/http';
import {
  encode
} from '../../../utils/encode';

var app = getApp();
var timer="";//定时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '', //设备状态
    queryStatus:'',//操作状态
    type:"",
    queryTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    that.setData({
      status: "查询中",
      queryStatus:"状态查询中...",
      type: options.type
    })
    that.queryStatus()
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },



  //定时任务
  queryStatus() {
    var that = this;
    
    let {
      sign,
      appid
    } = app.globalData
    const params = {
      sign: encode({
        sign: sign,
        appid: appid,
        type:this.data.type
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        sign: sign,
        appid: appid,
        type:this.data.type
      }
    }
    if (that.data.status != "当前电池可以使用") {
      http('qsq/service/external/deviceData/getDeviceStatus', JSON.stringify(params), 1, 1).then(res => {
        if(this.data.type=="0"){
          //let r = "0-1-12|15-0";
          var data = res.split("-");
          if (data[0] == "0") {
            that.setData({
              status: "当前电池可以使用",
              queryStatus: "换电完成"
            })
          }
        }else{
          that.data.queryTime+=1
          var data = res.split("-");
          if (data.length > 1) {
            var orderId = data[2].split("|");
          }
          if (orderId.indexOf(app.globalData.cusId + "") != -1) {
            that.setData({
              status: "当前电池可以使用",
              queryStatus: "预约完成"
            })
          }
          if (that.data.queryTime==2) {
            that.setData({
              status: "当前电池可以使用",
              queryStatus: "预约失败,请重试"
            })
          }
        }
       
      })
    }
    timer = setTimeout(function() {
      that.queryStatus()
    }, 8000)
    if (that.data.status == "当前电池可以使用") {
      clearTimeout(timer)
     
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //页面关闭，关闭定时任务
    clearTimeout(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})