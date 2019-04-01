// pages/map/cityLists/cityLists.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var bmap = require('../../../utils/bmap-wx.min.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCity:"",
    cityLists: ["北京市", "上海市", "南京市", "天津市", "成都市", "武汉市"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentCity: app.globalData.currentCity
    })
    this.queryOpenCity()
  },

  /**
   * 查找已开服务城市
   */
  queryOpenCity(){
    const {sessionId,type,levelTypeId} = app.globalData
    const params = {
      sign: encode({
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        openType:"1"
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        type: type,
        levelTypeId: levelTypeId,
        openType: "1"
      }
    }
    http('qsq/service/external/deviceData/getOpenCity', JSON.stringify(params), 1, 1).then(res=>{
      this.setData({
        cityLists:res
      })
    })
  },
  

  /**
   * 选择城市
   */
  chooseCity: function (e) {
    let { cityid } = e.target.dataset;
    var chooseCity="";
    if (cityid==0){
      chooseCity=this.data.currentCity
    }else{
      chooseCity = this.data.cityLists[cityid - 1]
    }
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      currentCity: chooseCity.cityName,
      latitude: chooseCity.latitude,
      longitude: chooseCity.longitude,
      markers:''
    })
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})