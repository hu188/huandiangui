// pages/serviceNetwork/cityService/cityService.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:"北京市",
    carList: [{ "name": "易马达服务中心", "address": "北京市朝阳区芍药居北里318号","openTime":"周一至周六 9：00-18：00","phoneNum":"123465789"},
      { "name": "天河店", "address": "北京市朝阳区芍药居北里318号", "openTime": "周一至周六 9：00-18：00", "phoneNum": "123465789" },],
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