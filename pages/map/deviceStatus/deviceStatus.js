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
    
    
    timer = setTimeout(function() {
      let {
        sign,
        appid
      } = app.globalData
      const params = {
        sign: encode({
          sign: sign,
          appid: appid,
          type: that.data.type
        }, app.globalData.sessionId),
        sessionId: app.globalData.sessionId,
        params: {
          sign: sign,
          appid: appid,
          type: that.data.type
        }
      }
    
        http('qsq/service/external/deviceData/getStatus', JSON.stringify(params), 1, 1).then(res => {
          if (that.data.type == "0") {
            //0-2-1-12|15 当前设备空闲-命令执行流水号-可以用于换电的电池数是1个，预约用户是12号和15号
            var data = res.split("-");
            if (data[0] == "0") {
                that.setData({
                  status: "当前电池可以使用",
                  queryStatus: "换电完成"
                })
              clearTimeout(timer)
            }else{
              that.setData({
                status: "当前电池可以使用",
                queryStatus: "换电失败，请重试！"
              })
              clearTimeout(timer)
            }     
          } else {
            that.data.queryTime += 1
            var data = res.split("-");
            if (data.length > 3) {
              var orderId = data[3].split("|");
            }
            if (orderId.indexOf(app.globalData.cusId + "") != -1) {
              that.setData({
                status: "当前电池柜有可使用的电池",
                queryStatus: "预约完成"
              })
              clearTimeout(timer)
            } else if (that.data.queryTime == 2){
              that.setData({
                status: data[2]>0?"当前电池柜有可使用的电池":"暂无可用电池",
                queryStatus: "预约失败,请重试"
              })
              clearTimeout(timer)
            }
          }

        })
      that.queryStatus()
    }, 8000)
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