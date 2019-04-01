// pages/menu/menu.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  //跳转到个人中心页面
  toMyCenter:function(){
    wx.navigateTo({
      url: '../myCenter/myCenter'
    })
  },
  toggleLeft1() {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {

  }
 
})