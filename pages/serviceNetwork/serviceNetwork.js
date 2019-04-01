// pages/serviceNetwork/serviceNetwork.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  carService: function () {
    wx.navigateTo({
      url: 'carService/carService',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

 
  batteryService: function () {
    wx.navigateTo({
      url: 'batteryService/batteryService',
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