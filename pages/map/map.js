import { http } from '../../utils/http';
import { encode } from '../../utils/encode';
const { $Toast } = require('../../Components/base/index');
var app = getApp();
//腾讯地图
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var wxMarkerData = [];
var qqmapsdk = new QQMapWX({
  key: 'VMDBZ-H7O3W-UMIRM-R5DNU-TK2J5-AGFJ5' // 必填
});

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    userInfo: null,
    hasUserInfo: true,
    userNick: '',
    markers: [],//地图上标记点
    circles: [],
    latitude: '',
    longitude: '',
    c_latitude: '',
    c_longitude: '',
    scale: '14',
    'show-location': true,
    dialog: 'dialog-un',
    c_marker: {},
    currentCity: '',
   // user: '',
    isLogin:false,
    sign:"",//设备名称
    appid:'',//小程序
    deviceStatus:"",
    show:false,
    distance:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断是否授权用户信息
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: resSetting => {
              app.globalData.userInfo = resSetting.userInfo;
              that.setData({
                userInfo: resSetting.userInfo,
                hasUserInfo: true,
                userNick: resSetting.userInfo.nickName
              });
            }
          });
          that.login(); 
        } else {
          that.setData({
            hidden: true,
            hasUserInfo: true
          });
        }
      }
    });
 
  },
  login() {
    var _self = this;
    wx.login({
      scopes: 'auth_user',
      success: (res) => {
        wx.getUserInfo({
          success: result => {
            const data = {
              "code": res.code,
              "keyPoolId": app.globalData.appid, //小程序id
            }
            let { encryptedData, iv}=result

            http('qsq/miniService/miniProComm/weChatCommon/commonLogin', JSON.stringify(data), 1, 1).then(lres => {
              app.globalData.sessionId = lres.sessionId;
              app.globalData.openid = lres.openid;
              app.globalData.cusId = lres.id;
              app.globalData.type = lres.type+"";
              app.globalData.levelTypeId = lres.levelTypeId+"";
              if(lres.userPhone){
                app.globalData.userPhone = lres.userPhone,
                app.globalData.isLogin=true
                this.setData({
                  isLogin:true
                })
              }
              const params = {
              sign: encode({
                openid: lres.openid,
                encryptedData: encryptedData,
                iv:iv
              }, lres.sessionId),
                sessionId: lres.sessionId,
              params: {
                openid: lres.openid,
                encryptedData: encryptedData,
                iv: iv
              }
              }
              http('qsq/miniService/miniProComm/weChatCommon/saveAnalysisData',JSON.stringify(params),1,1).then(sres=>{
                
              })
              _self.getCurrentCity() //显示当前城市
              _self.getCityDevice()//显示当前位置两千米内的设备
            })
          }
        })
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    const {
      errMsg
    } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      this.setData({
        hidden: false,
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        userNick: e.detail.userInfo.nickName
      });
      this.login();
    }

  },
  getCurrentLocation(){
    //判断是否授权
    var that = this;
    let {
      latitude,
      longitude
    } = that.data
    //判断用户是否授权地理位置
    that.getUserLocation();
   
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude //维度
          var longitude = res.longitude //经度
          that.setData({
            "latitude": latitude+"" ,
            "longitude": longitude+"" ,
            c_latitude: latitude,
            c_longitude: longitude
          });
          that.getCurrentCity();
          that.getCityDevice()
        }
         
      });
   
  },
  //获取当前位置附近两千米所有设备
  getCityDevice() {
    let {
      latitude,
      longitude
    } = this.data
    var that = this
    //console.log(app.globalData.type)
    const params = {
      sign: encode({
        "latitude": latitude,
        "longitude": longitude,
         "type": app.globalData.type,
        "levelTypeId": app.globalData.levelTypeId
      }, app.globalData.sessionId),
      sessionId: app.globalData.sessionId,
      params: {
        "latitude": latitude,
        "longitude": longitude,
        "type": app.globalData.type,
        "levelTypeId": app.globalData.levelTypeId
      }
    }
    //查询设备
    http('qsq/service/external/deviceData/getDeviceData', JSON.stringify(params), 1, 1).then(res => {
      
      for (var i = 0; i < res.length; i++) {
        res[i].iconPath = '../images/battery-d.png';
        res[i].width=20;
        res[i].height=25;
        res[i].id = i;
        res[i].label={
          content:" 1 ",
          anchorX: 5, 
          anchorY:-35,
          borderWidth:1,
          borderColor: '#008BD5',
          borderRadius:180,
          bgColor:"#ffffff",
          textAlign: 'center',
          color: '#008BD5',
         
        }
        //二级设备
        // var secondDevice = res[i].secondDevice;
       
        // if (secondDevice){
        //   var content = "";
        //   for (var j = 0; j < secondDevice.length; j++) {
        //     const { colsValues, remark } = secondDevice[j];
        //     content += "\n电池ID：" + remark + ","
        //     for (var key in colsValues) {
        //       content += key + ":" + colsValues[key]+",";
        //     }
        //     content = content.substring(0, content.length - 1)
        //   }
          
        // }
        // res[i].content = content
        // res[i].callout = {
        //   content: "充电柜:" + res[i].title + "\n电池数量：" + secondDevice.length + res[i].content ,
        //   color: "#000000",
        //   fontSize: "14",
        //   borderRadius: "10",
        //   bgColor: "#ffffff",
        //   padding: "10",
        //   display: "BYCLICK"//BYCLICK ALWAYS
        // }
      };
      
      wxMarkerData = res;
      that.setData({
        markers: res,
        // circles: [{
        //   latitude: that.data.latitude,
        //   longitude: that.data.longitude,
        //   color: '#eeeeee',
        //   fillColor: '#d1edff88',
        //   radius: 2500,//定位点半径

        // }]
      });
    })
  },
  //获取当前城市
  getCurrentCity() {
    var that = this; 
    const {
      latitude,
      longitude
    } = that.data
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      location: {
        latitude,
        longitude
      },
      success: function (res) {//成功后的回调
        that.setData({
          currentCity: res.result.address_component.city
        })
        app.globalData.currentCity ={
          "cityName": res.result.address_component.city,
          "latitude": that.data.c_latitude,
          "longitude": that.data.c_longitude
        } 
      },
      fail: function (error) {
        that.setData({
          currentCity: '定位失败'
        })
        app.globalData.currentCity = '定位失败'
      },
    })
  },



  //判断用户是否授权地理位置
  getUserLocation() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] == undefined || res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
              var latitude = res.latitude //维度
              var longitude = res.longitude //经度
              that.setData({
                "latitude": latitude+"" ,
                "longitude": longitude+"" ,
                c_latitude: latitude,
                c_longitude: longitude
              });
            },
            fail:function(res){
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    //用户取消授权
                    wx.showModal({
                      title: '授权提示',
                      content: '拒绝授权将无法享用地图功能',
                      success: function(res) {
                        if (res.cancel) {
                          that.toAccredit()  //发起授权请求
                        }
                      }
                    })
                  } else if (res.confirm) {
                    that.toAccredit()  //发起授权请求
                  }
                }
              })
            }
          });
        
        
        }
      }
    })
  },
  //发起授权请求
  toAccredit() {
    var that = this;
    //确定授权，通过wx.openSetting发起授权请求
    wx.openSetting({
      success: function(res) {
        if (res.authSetting["scope.userLocation"] == true) {
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
              var latitude = res.latitude //维度
              var longitude = res.longitude //经度
              that.setData({
                "latitude": latitude+"" ,
                "longitude": longitude+"" ,
                c_latitude: latitude,
                c_longitude: longitude
              });
              that.getCurrentCity()
            }
          });
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //判断是否授权
    var that = this;
    that.setData({
      isLogin:app.globalData.isLogin
    })
    let {
      latitude,
      longitude
    } = that.data
    //判断用户是否授权地理位置
    that.getUserLocation();
    if (latitude == "" || longitude==""){
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude //维度
          var longitude = res.longitude //经度
          that.setData({
            "latitude": latitude+"" ,
            "longitude": longitude+"",
            c_latitude: latitude,
            c_longitude: longitude
          });
          
        }
      });
    }
    //获取当前城市的所有设备
    if (latitude != "" && longitude != "") {

      that.getCityDevice()
    }
 
  },
  //点击标记点时触发，会返回marker的id
  makertap: function(e) {
    var that = this;
    var id = e.markerId;
    that.chooseMaker(wxMarkerData, id);
  },
  //点击地图时触发
  bindtap: function(e) {
    this.setData({
      'dialog': 'dialog-un',
    });
  },

  toNav: function() {
    var c_marker = this.data.c_marker;
    app.globalData.c_device = this.data.c_marker;
    // wx.navigateTo({
    //   url: 'chooseSite/chooseSite?latitude=' + c_marker.latitude + '&longitude=' + c_marker.longitude + '&address=' + c_marker.address,
    // })
    wx.navigateTo({
      url: 'chooseSite/chooseSite'
    })
  },
//选择标记点
  chooseMaker: function(data, id) {
    var that = this;
    var markersTemp = [];
    for (var i = 0; i < data.length; i++) {
     
       markersTemp[i] = data[i];
    }
    that.setData({
       markers: markersTemp,
      'c_marker': data[id],
      'dialog': 'dialog',
    });

 
    const {
      latitude,
      longitude
    } = that.data.c_marker
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      location: {
        latitude,
        longitude
      },
      success: function (res) {//成功后的回调
    
        that.data.c_marker.address = res.result.address
        that.setData({
          c_marker:that.data.c_marker
        })
      },
      fail: function (error) {
        var address = '定位失败';
      },
    })

    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
     
      to: [{
        latitude: latitude,
        longitude: longitude
      }], //终点坐标
      success: function (res) {//成功后的回调
        var res = res.result;
        for (var i = 0; i < res.elements.length; i++) {
          that.setData({ //设置并更新distance数据
            distance: res.elements[i].distance
          });
        }
      },
      fail: function (error) {
        console.error(error);
      },
    });
    // 终点经纬度
    let latEnd = latitude;
    let lngEnd = longitude;
    // 终点经纬度 当前位置
    let latStart = that.data.c_latitude;
    let lngStart = that.data.c_longitude;
    //网络请求设置
    let opt = {
      //WebService请求地址，from为起点坐标，to为终点坐标，开发key为必填
      url: `https://apis.map.qq.com/ws/direction/v1/bicycling/?from=${latStart},${lngStart}&to=${latEnd},${lngEnd}&key=${qqmapsdk.key}`,
      method: 'GET',
      dataType: 'json',
      //请求成功回调
      success: function (res) {
        let ret = res.data
        if (ret.status != 0) return; //服务异常处理
        let coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        let kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来
        that.setData({
          polyline: [{
            points: pl,
            color: '#1F9AE4',
            width: 3
          }]
        })
      }
    };
    wx.request(opt);
  },

  //拨打客服电话
  call() {
    wx.makePhoneCall({
      phoneNumber: '00000000' // 仅为示例，并非真实的电话号码
    })
  },
  //锁定当前位置
  currentLocation() {
    this.getCurrentLocation();
  
  },
  //刷新地图
  refresh() {
    this.onShow()
  },
  //扫码换电
  scanBattery() {
    const { cusId,sessionId,appid } = app.globalData
    var that = this;
    if (!that.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      // 允许从相机和相册扫码
      wx.scanCode({
        success(res) {
          var urlParam = res.result;
          var urlParams = urlParam.split("&");
          var signParam = urlParams[0].split("=");
          let sign = signParam[1];
          app.globalData.sign = signParam[1];
          that.setData({
            sign: sign,
          })
          const params = {
            sign: encode({
              sign: sign,
              appid: appid,
              type:"0"
            }, sessionId),
            sessionId:sessionId,
            params: {
              sign: sign,
              appid:appid,
              type:"0"
            }
          }
          //状态-可用电池数（不包括被预约的电池数）-预约用户ID1|预约用户ID2|…预约用户IDn-换电结果（1表示成功，0表示失败）   0-1-12|15-0 
          http('qsq/service/external/deviceData/getDeviceStatus', JSON.stringify(params),1,1).then(res => {
          console.log(res)
            var data = res.split("-");
            if(data.length>1){
              var orderId = data[2].split("|");
            }
          if(data[0]=="0"){
        
            if (data[1] == "0"){
              if (orderId.indexOf(cusId + "") != -1) {
                that.setData({
                  deviceStatus: "您已预约！",
                  show: true
                })
                if (timmer) clearTimeout(timmer);
                if (that.data.show) {
                  var timmer = setTimeout(() => {
                    that.handleHide();
                    timmer = null;
                  }, 3000);
                }
              } else{
                that.setData({
                  deviceStatus: "暂无可用电池！",
                  show: true
                })
                if (timmer) clearTimeout(timmer);
                if (that.data.show) {
                  var timmer = setTimeout(() => {
                    that.handleHide();
                    timmer = null;
                  }, 3000);
                }
              }

                
            }else{
              if (orderId.indexOf(cusId + "") != -1) {
                that.setData({
                  deviceStatus: "您已预约！",
                  show: true
                })
                if (timmer) clearTimeout(timmer);
                if (that.data.show) {
                  var timmer = setTimeout(() => {
                    that.handleHide();
                    timmer = null;
                  }, 3000);
                }
              } else{
                wx.navigateTo({
                  url: 'deviceStatus/deviceStatus?status=' + res + "&type=0",
                })
                http('qtg/service/external/chat/sendScanCodeDate', { sign: sign, type: 0, id: cusId }, 1).then(res => {
                  console.log(res)
                })
              }
            }
            
          }else if(data[0]=="1"){
            that.setData({
              deviceStatus:"当前设备正忙，请稍后再进行操作！",
              show:true
            })
             if (timmer) clearTimeout(timmer);
             if (that.data.show) {
             var   timmer = setTimeout(() => {
                 that.handleHide();
                 timmer = null;
               }, 3000);
             }
          } else if (data[0] == "2"){
            that.setData({
              deviceStatus: "当前设备故障，请稍后再进行操作",
              show: true
            })
            if (timmer) clearTimeout(timmer);
            if (that.data.show) {
              var timmer = setTimeout(() => {
                that.handleHide();
                timmer = null;
              }, 3000);
            }
          }else{
            that.setData({
              deviceStatus:res,
              show: true
            })
            if (timmer) clearTimeout(timmer);
            if (that.data.show) {
              var timmer = setTimeout(() => {
                that.handleHide();
                timmer = null;
              }, 3000);
            }
          }
          })

        }
      })
    }

  },
  //预约换电
  reserve(){
    const { cusId, sessionId, appid } = app.globalData
    var that = this;
    if (!that.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      let sign = encodeURI(this.data.c_marker.authInfo);
    
          app.globalData.sign=sign
          that.setData({
            sign: sign,
          })
          const params = {
            sign: encode({
              sign: sign,
              appid: appid,
              type:"1"
            }, sessionId),
            sessionId: sessionId,
            params: {
              sign: sign,
              appid: appid,
              type:"1"
            }
          }
          //状态-可用电池数（不包括被预约的电池数）-预约用户ID1|预约用户ID2|…预约用户IDn-换电结果（1表示成功，0表示失败）   0-1-12|15-0 
          http('qsq/service/external/deviceData/getDeviceStatus', JSON.stringify(params), 1, 1).then(res => {
           console.log(res)
            var data = res.split("-");
            if (data.length > 1) {
              var orderId = data[2].split("|");
            }
            if (data[0] == "0") {
              if (data[1] == "0") {
                if (orderId.indexOf(cusId + "") != -1) {
                  that.setData({
                    deviceStatus: "您已预约！",
                    show: true
                  })
                  if (timmer) clearTimeout(timmer);
                  if (that.data.show) {
                    var timmer = setTimeout(() => {
                      that.handleHide();
                      timmer = null;
                    }, 3000);
                  }
                } else {
                  that.setData({
                    deviceStatus: "暂无可用电池！",
                    show: true
                  })
                  if (timmer) clearTimeout(timmer);
                  if (that.data.show) {
                    var timmer = setTimeout(() => {
                      that.handleHide();
                      timmer = null;
                    }, 3000);
                  }
                }
              } else {
                if (orderId.indexOf(cusId + "") != -1) {
                  that.setData({
                    deviceStatus: "您已预约！",
                    show: true
                  })
                  if (timmer) clearTimeout(timmer);
                  if (that.data.show) {
                    var timmer = setTimeout(() => {
                      that.handleHide();
                      timmer = null;
                    }, 3000);
                  }
                }else{
                  wx.navigateTo({
                    url: 'deviceStatus/deviceStatus?status=' + res + "&type=1",
                  })
                  http('qtg/service/external/chat/sendScanCodeDate', { sign: sign, type: 1, id: cusId }, 1).then(res => {
                    console.log(res)
                  })
                }

              }

            } else if (data[0] == "1") {
              that.setData({
                deviceStatus: "当前设备正忙，请稍后再进行操作！",
                show: true
              })
              if (timmer) clearTimeout(timmer);
              if (that.data.show) {
                var timmer = setTimeout(() => {
                  that.handleHide();
                  timmer = null;
                }, 3000);
              }
            } else if (data[0] == "2") {
              that.setData({
                deviceStatus: "当前设备故障，请稍后再进行操作",
                show: true
              })
              if (timmer) clearTimeout(timmer);
              if (that.data.show) {
                var timmer = setTimeout(() => {
                  that.handleHide();
                  timmer = null;
                }, 3000);
              }
            } else {
              that.setData({
                deviceStatus: res,
                show: true
              })
              if (timmer) clearTimeout(timmer);
              if (that.data.show) {
                var timmer = setTimeout(() => {
                  that.handleHide();
                  timmer = null;
                }, 3000);
              }
            }
          })

        }
    
  
  },
  handleHide() {
    this.setData({
      deviceStatus:"",
      show:false
    });
  },
  //查看新闻
  viewNews() {
    wx.navigateTo({
      url: 'news/news',
    })
  },
  //拖动地图
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
    if (e.type == 'end' && ( e.causedBy == 'drag')) {
      var that = this;
      this.mapCtx = wx.createMapContext("map");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          that.setData({
            latitude: res.latitude+"",
            longitude: res.longitude+"",
            // circles: [{
            //   latitude: res.latitude,
            //   longitude: res.longitude,
            //   color: '#eeeeee',
            //   fillColor: '#d1edff88',
            //   radius: 2500,//定位点半径
            
            // }]

          })
         
          that.getCityDevice() 
        }
      
      })

    }

  },


})