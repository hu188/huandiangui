// pages/order/order.js
import { http } from '../../../utils/http';
import { encode } from '../../../utils/encode';
import { util } from '../../../utils/util';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_scroll: 'tab1',
    orderList:'',
    cusId:'',//用户id
    operateTypeRecord:'4'
    // orderList: [{ "orderNo": "DD123465", "orderTime": "2019-02-05", "orderPrice": "5.00" }, { "orderNo": "DD123465", "orderTime": "2019-02-05", "orderPrice": "5.00" }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryOrder("7")
  },
  //根据类型查找订单
  queryOrder: function (operateTypeRecord){
    var that = this;
    let { cusId,sessionId } = app.globalData;
    const params = {
      sign: encode({
        cusId: cusId+"",
        operateTypeRecord:operateTypeRecord
      }, sessionId),
      sessionId: sessionId,
      params: {
        cusId: cusId+"",
        operateTypeRecord: operateTypeRecord
      }
    }
    http('qsq/miniService/miniProComm/weChatCommon/getSpedingRecord', JSON.stringify(params), 1, 1).then(res => {
     
     for(var i=0;i<res.length;i++){
       res[i].orderTime = that.formatDateTime(res[i].createTime)
     }
      that.setData({
        orderList: res
      })
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
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' +  h + ':' + minute + ':' + second;
  },


  handleChange({ detail }) {
    this.setData({
      operateTypeRecord: detail.key,
    });
    this.queryOrder(this.data.operateTypeRecord)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }


})