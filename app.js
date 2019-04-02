//app.js
import { http } from './utils/http';
import { encode } from './utils/encode';
App({
  onLaunch: function () {

  },

  // login() {
  //   var that = this;
  //   wx.login({
  //     scopes: 'auth_user',
  //     success: (res) => {
  //       wx.getUserInfo({
  //         success: result => {
  //           const data = {
  //             "code": res.code,
  //             "keyPoolId": that.globalData.appid, //小程序id
  //           }
  //           let { encryptedData, iv } = result

  //           http('qsq/miniService/miniProComm/weChatCommon/commonLogin', JSON.stringify(data), 1, 1).then(lres => {
  //             that.globalData.sessionId = lres.sessionId;
  //             that.globalData.openid = lres.openid;
  //             that.globalData.cusId = lres.id;
  //             that.globalData.type = lres.type + "";
  //             that.globalData.levelTypeId = lres.levelTypeId + "";
  //             if (lres.userPhone) {
  //               that.globalData.userPhone = lres.userPhone,
  //               that.globalData.isLogin = true

  //             }
  //             const params = {
  //               sign: encode({
  //                 openid: lres.openid,
  //                 encryptedData: encryptedData,
  //                 iv: iv
  //               }, lres.sessionId),
  //               sessionId: lres.sessionId,
  //               params: {
  //                 openid: lres.openid,
  //                 encryptedData: encryptedData,
  //                 iv: iv
  //               }
  //             }
  //             http('qsq/miniService/miniProComm/weChatCommon/saveAnalysisData', JSON.stringify(params), 1, 1).then(sres => {

  //             })
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  //上传图片
  uploadimg(data) {
      var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'uploadFile',
      formData: { commdityId: data.cusId},
      success: (resp) => {
        success++;
        console.log(resp)
        console.log(i);
      },
      fail: (res) => {
        fail++;
        console.log('fail' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;
        if (i == data.path.length) { //图片上传完，停止调用
          console.log('执行完毕');
          console.log('成功：' + success + "失败：" + fail);
        } else { //图片还没上传完，继续调用
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    appid:"11",//小程序id
    sessionId:'',//加密秘钥,
    sign:'',
    openid:'',
    cusId:'',//用户id
    type:"",
    levelTypeId:"",
    currentCity:'',//当前城市
    selectGood:'',//购买的套餐
    userPhone:"",
    isLogin:false,
    c_device:'',//当前设备

  }
})