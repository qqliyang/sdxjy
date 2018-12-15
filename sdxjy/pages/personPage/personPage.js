// pages/personPage/personPage.js
var network = require("../../utils/request.js")
var time = require("../../utils/timestamp.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr: ['约聊', '案例', '课堂', '问答',],
    indexs:0,
    scroll:false,
    ceng:false,
    personMp:false,//个人名片
    chatBox: false,//一键约聊
    teacherId:'',
    TeacherBaseData:'',
    isOpen:false,//是否开启定位
    km:'',
    teacherSpecialityData:'',
    meetCommentData:[],
    contentData:[],
    answerData:[],
    totalRow:null,
    totalPage:'',
    page:1,
    pageSize:10,
    shareImg:'',
    loadBox: true,
    msg:'暂无相关内容',
    serviceDetail:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       //老师id
      let id = options.id
      var that = this;
      this.setData({
        teacherId: id
      },function(){
        that.getTeacherBaseMess();
        that.getShareImg();
      })
  },

  //距您多少km
  distance: function (la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = (Math.round(s * 10000) / 10000 / 1000).toFixed(2);
    return s
  },
  //获取
  getLocation:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({ isOpen: true })
        var longitude = res.longitude;
        var latitude = res.latitude;
        let longlat = that.data.TeacherBaseData.locationPoint.split(',')
        
        that.setData({
          km: that.distance(latitude, longitude, longlat[0], longlat[1])+'km'
        })
      },
      fail:function(){
        that.setData({ isOpen:false})
        console.log('未开启定位')
      }
    })
  },
  //再次打开授权
  openAuthSetting:function(){
    var that = this;
    wx.openSetting({
      success: function (data) {
        if (data.authSetting["scope.userLocation"] == true) {
          wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 2000
          })
          //再次授权，调用getLocationt的API
         setTimeout(function(){
           that.getLocation();
         },500)
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  //获取老师基本信息
  getTeacherBaseMess: function (city) {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: that.data.teacherId,
      }, '', function (res) {
        let data =res.data;
        //data.job = data.job.split('@');
        that.setData({
          TeacherBaseData:data,
          loadBox: false,
        },function(){
          console.log(11111, that.data.TeacherBaseData)
          that.getLocation();
          that.searchTeacherSpecialityList();
          that.searchMeetCommentList();
        })
      });
  },
  //查询老师擅长领域
  searchTeacherSpecialityList:function(){
      var that = this;
      network.requestLoading('GET', app.globalData.requestUrl + 'teacher/getSpecialityList',
      {
        customerId: that.data.teacherId,
      }, '', function (res) {
        console.log(res)
        that.setData({
          teacherSpecialityData: res.data
        })
      });
  },
  //查询对老师的评价
  searchMeetCommentList:function(){
      var that = this;
      that.setData({
        isLoad: true,
        noMore: false
      })
      network.requestLoading('GET', app.globalData.requestUrl + 'teacher/getMeetCommentList',
      {
        toCustomerid: that.data.teacherId,
        page:that.data.page,
        pageSize: that.data.pageSize,
      }, '', function (res) {
        let data = res.data.list;
        for (let i in data) {
          //IOS只识别2017/01/01这样的日期格式，
          data[i].createTime = (data[i].createTime).replace(/-/g, '/');
          data[i].createTime = time.timestampFormat(Date.parse(data[i].createTime) / 1000)
        }
        that.setData({
          meetCommentData: that.data.meetCommentData.concat(data),
          totalRow: res.data.totalRow,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          isLoad:false,
        },function(){
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        })
      },function(){
        that.setData({
          isLoad:false,
        })
      });
  },
  //获取老师案例
  getContentList:function(){
      var that = this;
      that.setData({
        isLoad: true,
        noMore: false
      })
      network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentList',
      {
        customerId: that.data.teacherId,
        page:that.data.page,
        pageSize: that.data.pageSize, 
      }, '', function (res) {
        console.log(res)
        that.setData({
          contentData: that.data.contentData.concat(res.data.list),
          totalRow: res.data.totalRow,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          isLoad: false,
        },function(){
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        })
      },function(){
        that.setData({
          isLoad: false,
        })
      });
  },
  //获取老师问答
  searchAnswerList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'teacher/getQuestionAnsweredList',
      {
        customerId: that.data.teacherId,
        page: that.data.page,
        pageSize: that.data.pageSize,
      }, '', function (res) {
        console.log(res)
        that.setData({
          answerData: that.data.answerData.concat(res.data.list),
          totalRow: res.data.totalRow,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          isLoad: false,
        }, function () {
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
        })
      }, function () {
        that.setData({
          isLoad: false,
        })
      });
  },
  //查看详情
  seeDetails: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/articleDetails/articleDetails?contentId=' + id,
    })
  },
  onPageScroll:function(e){
   
    if (e.scrollTop >= 250) {
      this.setData({
        scroll: true
      })
    }
    else {
      this.setData({
        scroll: false
      })
    }
  },
  setIndex:function(e){
      let index = e.currentTarget.dataset.index;
      if(this.data.indexs == index){
        return
      }
      var that = this;
      this.setData({
        indexs:index,
        page:1,
        meetCommentData:[],
        contentData:[],
        answerData:[],
        totalRow:null,
      },function(){
       
        //约聊
        if (index == 0){
          that.searchMeetCommentList();
        }
        //案例
        if (index == 1) {
          that.getContentList();
        }
        //课堂
        if (index == 2) {
          that.searchMeetCommentList();
        }
        //问答
        if (index == 3) {
          that.searchAnswerList();
        }
      }) 
  },
  totaggle: function (e) {
    let index = e.currentTarget.dataset.index;
    var that = this;
    that.data.answerData[index].totaggle = true;
    that.setData({
      answerData: that.data.answerData
    })
  },
  expertClick:function(e){
      let content = e.currentTarget.dataset.content;
      let title = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: '/pages/expert/expert?content=' + content+'&title='+title,
      })
  },
  //获取分享名片
  getShareImg:function(){
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'member/getSPCode',
      {
        customerId: that.data.teacherId,
      }, '', function (res) {
        that.setData({
          shareImg: res.data
        })
      });
  },
  saveImg:function(){
    var that = this;
    console.log(that.data.shareImg)
    wx.downloadFile({
      url: that.data.shareImg,     //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '图片已保存相册！',
              })
            },
            fail(res) {
              wx.showToast({
                title: '保存失败！',
              })
            }
          })
        }
      }
    })
  },
  share:function(){
      this.setData({
        ceng:!this.data.ceng,
        personMp: !this.data.personMp
      })
  },
  close:function(){
      this.setData({
        ceng: false,
        personMp: false,
        chatBox:false
      })
  },
  chact:function(){
      this.setData({
        ceng: !this.data.ceng,
        chatBox: !this.data.chatBox
      })
    this.getServicePrice();
  },
  //获取预约服务价格详情
  getServicePrice: function () {
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'meetPrice/list',
      {
        customerId: that.data.TeacherBaseData.customerId,
      }, '', function (res) {
        that.setData({
          serviceDetail: res.data.list,
          ceng: true,
          chatBox: true,
        })
      });
  },
  //去购买
  buyService: function (e) {
    let obj = JSON.stringify(e.currentTarget.dataset.obj);
    wx.navigateTo({
      url: '/pages/telephoneHigherLearning/telephoneHigherLearning?data=' + obj,
    })
    this.setData({
      ceng: false,
      chatBox: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      var that = this;
      //最后一页不请求
      if (that.data.totalRow == 0) {
        return
      }
      if (that.data.totalPage == that.data.page) {
        return
      }
      that.setData({
        page: that.data.page + 1,
      }, function () {
        let index = that.data.indexs;
        //约聊
        if (index == 0) {
          that.searchMeetCommentList();
        }
        //案例
        if (index == 1) {
          that.getContentList();
        }
        //课堂
        if (index == 2) {
          that.searchMeetCommentList();
        }
        //问答
        if (index == 3) {
          that.searchAnswerList();
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '您的高考专家（' + this.data.TeacherBaseData.customerName+'）',
      path: '/pages/index/index?type=personPage' + "&teacherId=" + this.data.teacherId,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})