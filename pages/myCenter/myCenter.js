// pages/myCenter/myCenter.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
const { $Toast } = require('../../Components/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:["男","女"],
    endData:'',
    name:'123',
    date:'1991-01-01',
    realName:'',
    idNumber:'',
    userInfo: "",
    userPhone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      userPhone:app.globalData.userPhone
      // idNumber: app.globalData.realName,
      // realName: app.globalData.idNumber           
    })

 
    // if(options.name){
    //   this.setData({
    //     name: options.name
    //   })
    // }
   
  //   var timestamp = Date.parse(new Date());
  //   var date = new Date(timestamp);
  //   //获取年份  
  //   var Y = date.getFullYear();
  //   //获取月份  
  //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //   //获取当日日期 
  //   var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //   this.setData({
  //     endData: Y + '-' + M + '-' + D,
  //   })
  },
  queryUser() {
    const {sessionId,openid} = app.globalData
    const params = {
      sign: encode({
        sessionId: sessionId,
        openid: openid
      },sessionId),
      sessionId:sessionId,
      params: {
        sessionId: sessionId,
        openid: openid
      }
    }
    http('qsq/miniService/miniProComm/weChatCommon/getWeChatUser', JSON.stringify(params), 1, 1).then(res=>{
     if(res.realName && res.idNumber){
       this.setData({
         idNumber: res.realName,
         realName: res.idNumber
       })
     }
    })
  },

  //换头像
  // changeImage:function(){
  //   var _this = this
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       _this.setData({
  //         iamgeUrl: res.tempFilePaths
  //       })
  //       //const tempFilePaths = res.tempFilePaths
  //     }
  //   })
  // },

  //切换性别
  // bindPickerChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },
  // //选择生日
  // bindDateChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },
  // saveInfo:function(){
  //   $Toast({
  //     content: '修改成功',
  //     type: 'success'
  //   });
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryUser()
  },

 
})