// pages/taoCan/payTc/payTc.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
const { $Toast } = require('../../../Components/base/index');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectGood: '',
    array:["暂无"],
    balance:0,
    payWay:0,//0：微信支付 1：余额支付
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        selectGood: app.globalData.selectGood
      })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPaymentChange:function(e){
    this.setData({
      payWay:e.detail.value
    })
  },

  saveOrder: function (e) {
    const { type, levelTypeId, appid, sessionId, cusId } = app.globalData;
    const { selectGood, payWay } = this.data;
    const params = {
      sign: encode({
        money: selectGood.money+"",
        goodName: selectGood.rechargeName,
        operateType:'3',
        sessionId: sessionId,
        cusId: cusId + "",
        keyPoolId: appid + "",
        type: type + "",
        levelTypeId: levelTypeId + "",
        num:1,
        rechargeType:"1"
      }, sessionId),
      sessionId: sessionId,
      params: {
        money: selectGood.money + "",
        goodName: selectGood.rechargeName,
        operateType: '3',
        sessionId: sessionId,
        cusId: cusId + "",
        keyPoolId: appid + "",
        type: type + "",
        levelTypeId: levelTypeId + "",
        num:1,
        rechargeType: "1"
      }
    }
    //生成预支付订单
    http('qsq/service/external/WeChatUser/savePayOrder', JSON.stringify(params), 1, 1).then(res => {
      if (res.orderNo){
        if (payWay=="0"){
          this.pay(res.orderNo);//微信支付
        }else{
          this.balancePay(res.orderNo)//余额支付
        }
      }else{
        $Toast({
          content: '订单创建失败',
          type: 'error'
        });
      }
      
    })
  },

  //微信支付
  pay(orderNo) {
    const { appid, sessionId, openid } = app.globalData;
    const params = {
      sign: encode({
        sessionId: sessionId,
        orderNo: orderNo,
        keyPoolId: appid + "",
        openid: openid
      }, sessionId),
      sessionId: sessionId,
      params: {
        sessionId: sessionId,
        orderNo: orderNo,
        keyPoolId: appid + "",
        openid: openid
      }
    }
    http('qsq/service/external/WeChatUser/saveWeChatPay', JSON.stringify(params), 1, 1).then(res => {
      const { nonceStr, packageValue, paySign, signType, timeStamp } = res
      wx.requestPayment({
        timeStamp: res.timeStamp + '',
        nonceStr: res.nonceStr,
        package: 'prepay_id=' + res.prepay_id,
        signType: 'MD5',
        paySign: res.paySign,
        success: () => {
          $Toast({
            content: '购买成功',
            type: 'success'
          });
          wx.navigateBack({
            delta: 2
          })
        },
        fail: () => {
          $Toast({
            content: '购买失败',
            type: 'error'
          });
        }
      })
    })
  },
  //余额支付
  balancePay(orderNo){
    const { appid, sessionId, cusId,type,levelTypeId } = app.globalData;
    const { selectGood, balance} = this.data;
    if (selectGood.money<=balance){
      const params = {
        sign: encode({
          sessionId: sessionId,
          money: selectGood.money*100+"",
          totalCount: selectGood.rechargeCount+"",
          rechargeName:selectGood.rechargeName,
          orderNo: orderNo,
          cusId: cusId+"",
          rechargeId: selectGood.id+"",
          type: type+"",
          levelTypeId:levelTypeId+""
        }, sessionId),
        sessionId: sessionId,
        params: {
          sessionId: sessionId,
          money: selectGood.money * 100 + "",
          totalCount: selectGood.rechargeCount+"",
          rechargeName: selectGood.rechargeName,
          orderNo: orderNo,
          cusId: cusId + "",
          rechargeId: selectGood.id + "",
          type: type + "",
          levelTypeId: levelTypeId + ""
        }
      }

      http('qsq/service/external/WeChatUser/saveBalancePay', JSON.stringify(params), 1, 1).then(res => {
        if (res == "1") {
          $Toast({
            content: '支付成功',
            type: 'success'
          });
          wx.navigateBack({
            delta: 2
          })
        } else {
          $Toast({
            content: '支付失败',
            type: 'error'
          });
        }

      })
    }else{
      $Toast({
        content: '余额不足，支付失败',
        type: 'error'
      });
    }
    
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
        balance: res.chargeMoney / 100
      })
    })
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