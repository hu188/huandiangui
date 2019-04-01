// pages/myCenter/realName/realName.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
var app = getApp();
const { $Toast } = require('../../../Components/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName:'',
    idcard:'',
    // frontImg:"../../images/add.jpg",//正面照
    // reverseImg:"../../images/fan.jpg",//反面照
    uploaderList: [],
    showUpload: true,//是否显示+图形
    uploaderNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.realName){
      this.setData({
        realName: options.realName,
        idcard: options.idcard
      })
    }
  },

  //实名认证
  identification: function (e) {
    let { realName, idcard } = e.detail.value;
    this.setData({
      realName: realName,
      idcard: idcard
    })
    if (realName == "" || idcard == "") {
      $Toast({
        content: '请输入姓名和身份证号码',
        type: 'warning'
      });
    }

    this.uploadimg()
  },

  // 删除图片
  clearImg: function (e) {
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //选择需要上传的图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 2 - this.data.uploaderNum , // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length >= 2) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
      }
    })
  },
  //上传图片
  uploadimg: function () {
    var imageList = this.data.uploaderList;
    app.uploadimg({
      url: 'https://qsq.mynatapp.cc/qsqFile/service/upload/imagess',//这里是你要上传的服务器接
      path: imageList,//这里是你最开始定义的图片数组
      cusId: app.globalData.cusId
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