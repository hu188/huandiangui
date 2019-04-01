// pages/recharge/recharge.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
const { $Toast } = require('../../../Components/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xz: 0,
    czlist: [],
    orderNo:"",//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let { type,levelTypeId, sessionId } = app.globalData;
    const params = {
      sign: encode({
        type: type+"",
        levelTypeId: levelTypeId+"",
        sessionId: sessionId,
        rechargeType:"0"
      }, sessionId),
      sessionId: sessionId,
      params: {
        type: type+"",
        levelTypeId: levelTypeId+"",
        sessionId: sessionId,
        rechargeType: "0"
      }
    }
    http('qsq/service/external/deviceData/getReChargeData', JSON.stringify(params), 1, 1).then(res => {
      that.setData({
        czlist: res
      })
    })
  },

  xuanz: function (e) {
    var t = this, a = e.currentTarget.dataset.id;
    t.setData({
      xz: a
    });
  },
  czsave:function(e){
    const { type, levelTypeId,appid, sessionId, cusId } = app.globalData;
    const {xz,czlist} = this.data;
    const item = czlist[xz];
    const { money, giveMoney } = item
    const params = {
      sign: encode({
        money:money+"",
        sessionId: sessionId,
        operateType: '1', 
        cusId: cusId+"",
        keyPoolId: appid+"",
        type: type + "",
        levelTypeId: levelTypeId + "",
        rechargeType: "0"
      }, sessionId),
      sessionId: sessionId,
      params: {
        money: money+"",
        sessionId: sessionId,
        operateType: '1',
        cusId: cusId+"",
        keyPoolId:appid+"",
        type: type + "",
        levelTypeId: levelTypeId + "",
        rechargeType: "0"
      }
    }
    //生成预支付订单
    http('qsq/service/external/WeChatUser/savePayOrder', JSON.stringify(params), 1,1).then(res=>{
      this.pay(res.orderNo);
    })

  },
  pay(orderNo){
    const { appid, sessionId, openid } = app.globalData;
    const params = {
      sign: encode({
        sessionId: sessionId,
        orderNo: orderNo,
        keyPoolId: appid + "",
        openid:openid
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        orderNo: orderNo,
        keyPoolId: appid + "",
        openid: openid
      }
    }
    http('qsq/miniService/miniProComm/weChatCommon/saveCommonPay', JSON.stringify(params), 1,1).then(res => {
      const { nonceStr, packageValue, paySign, signType, timeStamp } = res
      wx.requestPayment({
        timeStamp: res.timeStamp + '',
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: 'MD5',
        paySign: res.paySign,
        success: () => {
          $Toast({
            content: '充值成功',
            type: 'success'
          });
        },
        fail: () => {
          $Toast({
            content: '充值失败',
            type: 'error'
          });
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },





})