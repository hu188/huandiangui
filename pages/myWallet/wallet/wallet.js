// pages/wallet/wallet.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    cusId:'',//用户id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    let { openid, sessionId } = app.globalData;
    const params = {
      sign: encode({
        openid: openid,
      }, sessionId),
      sessionId: sessionId,
      params: {
        openid: openid,
      }
    }
    http('qsq/miniService/miniProComm/weChatCommon/getWeChatUser', JSON.stringify(params), 1, 1).then(res => {
      that.setData({
        balance: res.chargeMoney/100
      })
    })
  },

 //查看优惠券
  viewCounpon: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },

  //押金退还
  refund: function () {
    wx.navigateTo({
      url: '../refund/refund',
    })
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