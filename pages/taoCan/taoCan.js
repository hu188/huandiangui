// pages/taoCan/taoCan.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    tcList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //查询我的套餐
  queryMyMeal(){
    var that = this;
    let { type, levelTypeId, sessionId,cusId } = app.globalData;
    const params = {
      sign: encode({
        type: type + "",
        levelTypeId: levelTypeId + "",
        sessionId: sessionId,
        cusId: cusId+""
      }, sessionId),
      sessionId: sessionId,
      params: {
        type: type + "",
        levelTypeId: levelTypeId + "",
        sessionId: sessionId,
        cusId: cusId + ""
      }
    }
    http('qsq/service/external/WeChatUser/getMyMeals', JSON.stringify(params), 1, 1).then(res => {
      if(res){
        for(var i=0;i<res.length;i++){
          res[i].time =that.formatDateTime(res[i].endTime)
        }
      }
      that.setData({
        tcList: res
      })
    })
  },
  buyTc:function(){
    wx.navigateTo({
      url: 'chooseTc/chooseTc'
    })
  },
  //格式化时间
  formatDateTime: function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
  
    return y + '-' + m + '-' + d;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryMyMeal()
  },
  useMeals(){
    var that = this;
    let { type, levelTypeId, sessionId, cusId } = app.globalData;
    const params = {
      sign: encode({
        type: type + "",
        levelTypeId: levelTypeId + "",
        sessionId: sessionId,
        cusId: cusId + ""
      }, sessionId),
      sessionId: sessionId,
      params: {
        type: type + "",
        levelTypeId: levelTypeId + "",
        sessionId: sessionId,
        cusId: cusId + ""
      }
    }
    http('qsq/service/external/WeChatUser/saveMealUseTime', JSON.stringify(params), 1, 1).then(res=>{
      console.log(res)
    })
  }
 
})