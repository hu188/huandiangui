const { $Toast } = require('../../Components/base/index');
import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
var app = getApp();
var baseUrl = getApp().baseUrl;
var ctx;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',//验证码
    isAgree:'',//是否同意注册协议
    phoneNum:'',//手机号码
    verificationCode:'',//验证码
    show:false,
    length: 4,        //输入框个数
    isFocus: true,    //聚焦
    value: "",        //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
    isPhoneNum:false,//是否是正确的手机号
    time:60,//计时时间
    code:"获取验证码",
    flag:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    drawPic(that);
   
  },
  //查看注册协议
  viewAgreement:function(){
    wx:wx.navigateTo({
      url: 'registerAgreement/registerAgreement',
    })
  },
  //注册协议是否勾选
  choose:function(e){
    console.log(e)
    this.setData({
      isAgree: e.detail.value
    })
  },
  //获取手机号
  getPhoneNum:function(e){
    //验证是否是正确的的手机号
    if (!(/^1[34578]\d{9}$/.test(e.detail.value))) {
      this.setData({
        isPhoneNum: false
      })
    } else{
      this.setData({
        phoneNum: e.detail.value,
        isPhoneNum:true
      })
    }
  },
  //登录
  login:function(e){
    let { phoneNum, verificationCode}=e.detail.value;
    this.setData({
      phoneNum: phoneNum,
      verificationCode:verificationCode
    })
    if (phoneNum=="" || verificationCode=="") {
      $Toast({
        content: '手机号和验证码必须输入',
        type: 'warning'
      });
    }
    if (this.data.isAgree.length==0){
      $Toast({
        content: '请勾选用户协议',
        type: 'warning'
      });
    }
    var verifyCode = this.getStorageData("verifyCode","验证码无效");
    
    if (verificationCode == verifyCode){
      const {sessionId,openid} = app.globalData
      const params = {
        sign: encode({
          userPhone: this.data.phoneNum,
          openid:openid
        }, sessionId),
        sessionId:sessionId,
        params: {
          userPhone: this.data.phoneNum,
          openid:openid
        }
      }
      http('qsq/service/external/WeChatUser/saveUserLogin', JSON.stringify(params), 1, 1).then(res=>{
        if(res==1){
          app.globalData.isLogin=true
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }else{
      $Toast({
        content: "验证码无效",
        type: 'error'
      });
    }
  },
  //刷新验证码
  refreshImg(){
    var that = this;
    drawPic(that);
  },
  //获取用户输入的图片验证码并校验
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      value: inputValue,
    })
    if (inputValue.length==4 && this.data.value.toUpperCase() == this.data.text){
      that.setData({
        show: false,
      })
      $Toast({
        content: '输入正确',
        type: 'success'
      });
      const params = {
        sign: encode({
          phoneNumber: that.data.phoneNum,
        }, app.globalData.sessionId),
        sessionId: app.globalData.sessionId,
        params: {
          phoneNumber: that.data.phoneNum,
        }
      }
      that.countTime()
      //请求获取验证码，并存入缓存
      http('qsq/service/external/getCode/getLoginCode',JSON.stringify(params), 1, 1).then(res=>{
          if(res.code=="OK"){
            that.putStorageData("verifyCode", res.verifyCode,120);
          }else{
            $Toast({
              content: '获取失败',
              type: 'error'
            });
          }
      })
    } else if (inputValue.length == 4){
      that.setData({
        value: ''
      })
      drawPic(that);
      $Toast({
        content: '输入错误',
        type: 'error'
      });
   }
  },
  wait(){
    $Toast({
      content: '60秒后再进行操作',
    });
  },
  countTime() {
   
    if (this.data.time > 0) {
      this.data.time--;
      this.setData({
         code: this.data.time + 's后获取',
         flag:false
          });
      var timer = setTimeout(() => {
        this.countTime();
      }, 1000);
    } else {
      this.data.time = 60;
      clearTimeout(timer);
      this.setData({ 
        code: '获取验证码',
        flag: true
        });
    }
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  //把数据放入缓存  time为可选参数表示有效时间（单位：秒）
  putStorageData:function (key, val, time) {
    wx.setStorageSync(key, val)
    var seconds = parseInt(time);
    if(seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(key + 'dtime', timestamp + "")
} else {
  wx.removeStorageSync(key + 'dtime')
}
},
//读取缓存 def为可选参数，表示无缓存数据时返回值
  getStorageData:function (key, def) {
    var deadtime = parseInt(wx.getStorageSync(key + 'dtime'))
    if(deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        wx.removeStorageSync(key);
        wx.removeStorageSync(key + 'dtime');
        if (def) { return def; } else { return; }
      }
    }
    var res = wx.getStorageSync(key);
    if (res) {
      return res;
    } else if (def) {
      return def;
    } else {
      return;
    }
  },

  //显示图片验证码模态框
  getCode(){
    var that = this;
    that.setData({
      show: true,
      value:''
    })
    drawPic(that);
  },
//关闭图片验证码模态框
  closeModel(){
    var that = this;
    that.setData({
      show: false
    })
  },
  change: function () {
    var that = this;
    drawPic(that);
  },
})
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
/**生成一个随机色**/
function randomColor(min, max) {
  var r = randomNum(min, max);
  var g = randomNum(min, max);
  var b = randomNum(min, max);
  return "rgb(" + r + "," + g + "," + b + ")";
}

/**绘制验证码图片**/
function drawPic(that) {
  ctx = wx.createCanvasContext('canvas');
  /**绘制背景色**/
  ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
  ctx.fillRect(0, 0, 110, 40)
  /**绘制文字**/
  var arr;
  var text = '';
  var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
  for (var i = 0; i < 4; i++) {
    var txt = str[randomNum(0, str.length)];
    ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
    ctx.font = randomNum(22, 30) + 'px SimHei'; //随机生成字体大小
    var x = 5 + i * 20;
    var y = randomNum(20, 25);
    var deg = randomNum(-20, 20);
    //修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(txt, 5, 0);
    text = text + txt;
    //恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  /**绘制干扰线**/
  for (var i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, 90), randomNum(0, 28));
    ctx.lineTo(randomNum(0, 90), randomNum(0, 28));
    ctx.stroke();
  }
  /**绘制干扰点**/
  for (var i = 0; i < 20; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, 90), randomNum(0, 28), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.draw(false, function () {
    that.setData({
      text: text
    })
  });
}

