// pages/myCenter/changeName/changeName.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
    })
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

  //保存名称
  formSubmit: function (e) {
    let {name}= e.detail.value;
    this.setData({
      name:name
    })

    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    console.log(pages)
    let prevPage = pages[pages.length - 2];
    console.log(prevPage)
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      name:name
    })
    wx.navigateBack({
      delta: 1  // 返回上一级页面。
    })
  },


})