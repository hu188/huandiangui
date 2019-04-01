// pages/taoCan/buyTc/buyTc.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tcList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // this.queryReChargeData()
  },
  queryReChargeData(){
    var that = this;
    let { type, levelTypeId, sessionId } = app.globalData;
    const params = {
      sign: encode({
        type: type + "",
        levelTypeId: levelTypeId + "",
        sessionId: sessionId,
        rechargeType: "1"
      }, sessionId),
      sessionId: sessionId,
      params: {
        type: type + "",
        levelTypeId: levelTypeId + "",
        sessionId: sessionId,
        rechargeType: "1"
      }
    }
    http('qsq/service/external/deviceData/getReChargeData', JSON.stringify(params), 1, 1).then(res => {
      that.setData({
        tcList: res
      })
    })
  },
  tobuy:function(e){
    const {tcList} = this.data
    var i = e.currentTarget.dataset.id;
    app.globalData.selectGood = tcList[i]
    wx.navigateTo({
      url: '../payTc/payTc'
    })
  },
  tcExplain: function () {
    wx.navigateTo({
      url: '../tcExplain/tcExplain'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryReChargeData()
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