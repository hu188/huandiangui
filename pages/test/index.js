//index.js
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';

//获取应用实例
const app = getApp()
Page({
  data: {
    deviceId:'525769565'
  },



  onLoad: function () { 
    const params = {
      deviceId:this.data.deviceId
    }
    http('qsq/service/external/device/deviceTest',params, 1, 1).then(res => {
     console.log(res)
    })

  }
})