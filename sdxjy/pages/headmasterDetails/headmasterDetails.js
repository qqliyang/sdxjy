// pages/headmasterDetails/headmasterDetails.js
var network = require("../../utils/request.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      id: 0,
      latitude: '',
      longitude: ''
    }],
    longitude:'',
    latitude:'',
    indicatorDots: false,
    autoplay: true,
    interval: 10000,
    duration: 1000,
    map:false,
    tabArr: ['团队', '案例', '讲座', '活动', '办事处',],
    indexs: 0,
    scroll: false,
    baseData:'',
    page:1,
    pageSize:10,
    orgId:'',
    teamData:[],
    exampleData:[],
    activity:[],
    addressData:[],
    lecture:[],
    hdArr1:[],
    hdArr2:[],
    loadBox:true,
    totalRow:'',
    msg:'暂无相关内容'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let data = JSON.parse(options.data);
      let locationPoint = (data.locationPoint).split(',');
      this.data.markers[0].longitude = locationPoint[0];
      this.data.markers[0].latitude = locationPoint[1];
      var that = this;
      this.setData({
        markers: this.data.markers,
        baseData:data,
        longitude: locationPoint[0],
        latitude: locationPoint[1],
        orgId: data.orgId
      },function(){
        that.getTeamCustomerList();
      })
  },
  
  //获取团队数据
  getTeamCustomerList:function(){
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerList',
      {
        page: that.data.page,
        pageSize: that.data.pageSize,
        orgId: that.data.orgId,
        sourceId:'',
      }, '', function (res) {
        that.setData({
          loadBox:false,
          totalRow: res.data.totalRow,
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          teamData: that.data.teamData.concat(res.data.list)
        },function(){
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
  //获取案例数据
  getExampletCustomerList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentList',
      {
        page: that.data.page,
        pageSize: that.data.pageSize,
        orgId: that.data.orgId,
        contentType: '案例',
      }, '', function (res) {
        that.setData({
          loadBox: false,
          totalRow: res.data.totalRow,
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          exampleData: that.data.exampleData.concat(res.data.list)
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
  //讲座
  getLectureList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'lecture/getLectureList',
      {
        page: that.data.page,
        pageSize: that.data.pageSize,
        orgId: that.data.orgId,
        sourceId:app.globalData.customerId
      }, '', function (res) {
        that.setData({
          loadBox: false,
          totalRow: res.data.totalRow,
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          lecture: that.data.lecture.concat(res.data.list)
        }, function () {
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
  
          let timestamp = parseInt(new Date().getTime() / 1000);  //当前时间戳
          //活动时间戳
          let data = that.data.lecture;
          let hdArr1 = [];
          let hdArr2 = [];
          
          for (let i in data) {
            data[i].isEffect = ((new Date(Date.parse(data[i].lectureTime.replace(/-/g, "/")))).getTime() / 1000 - timestamp)>0?true:false;

            //未失效活动
            if (data[i].isEffect){
              hdArr1.push(data[i])
            }
            else{
              hdArr2.push(data[i])
            }
          }
          console.log(hdArr1)
          that.setData({
            lecture: data,
            hdArr1: hdArr1,
            hdArr2: hdArr2
          })

        })
      }, function () {
        that.setData({
          isLoad: false,
        })
      });
  },
  //获取活动数据
  getActivityList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'content/getContentList',
      {
        page: that.data.page,
        pageSize: that.data.pageSize,
        orgId: that.data.orgId,
        contentType: '活动',
      }, '', function (res) {
        that.setData({
          loadBox: false,
          totalRow: res.data.totalRow,
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          activity: that.data.activity.concat(res.data.list)
        }, function () {
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
          console.log(that.data.activity)
          let data = that.data.activity;
          for (let i in data){
            data[i].coverArr = typeof (data[i].cover) == "object" ? data[i].cover : (data[i].cover).split('@');
          }
          console.log(9999, data)
          that.setData({
            activity: data
          })
         
        })
      }, function () {
        that.setData({
          isLoad: false,
        })
      });
  },
  //获取办事处数据
  getAddressList: function () {
    var that = this;
    that.setData({
      isLoad: true,
      noMore: false
    })
    network.requestLoading('GET', app.globalData.requestUrl + 'org/getOrgList',
      {
        page: that.data.page,
        pageSize: that.data.pageSize,
        orgPid: that.data.orgId,
      }, '', function (res) {
        that.setData({
          loadBox: false,
          totalRow: res.data.totalRow,
          isLoad: false,
          totalPage: Math.ceil(res.data.totalRow / that.data.pageSize),
          addressData: that.data.addressData.concat(res.data.list)
        }, function () {
          if (that.data.page == that.data.totalPage) {
            that.setData({
              noMore: true
            })
          }
          //加上自己并返回
          if(that.data.page == 1){
            that.data.addressData.unshift(that.data.baseData)
            that.setData({
              addressData: that.data.addressData
            },function(){
              console.log(99999, that.data.addressData)
            })
            
          } 
        })
      }, function () {
        that.setData({
          isLoad: false,
        })
      });
  },
  //到老师个人空间
  seePersonPage: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personPage/personPage?id=' + id,
    })
  },
  //讲座立即报名
  startEnroll:function(e){
    let status = e.currentTarget.dataset.status;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    if(status == 1){
      wx.showToast({
        title: '已经报名了',
        icon:"none"
      })
      return
    }
    this.getUserMess(id,index);
  },
  //获取用户个人信息
  getUserMess:function(id,index){
    var that = this;
    network.requestLoading('GET', app.globalData.requestUrl + 'cust/getCustomerById',
      {
        customerId: app.globalData.customerId,
      }, '', function (res) {
        if (!(res.data.phone)){
          wx.showModal({
            title: '提示',
            content: '您当前暂无实名信息，填写后可以报名！',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/mineCard/mineCard?jz=true',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        else{
          that.enscroll(id,index);
        }
      });
  },
  //立即报名
  enscroll: function (id,index) {
    var that = this;
    network.requestLoading('POST', app.globalData.requestUrl + 'lecture/addLectureOrder',
      {
        customerId: app.globalData.customerId,
        lectureId:id
      }, '', function (res) {
        wx.showToast({
          title: '报名成功',
        })
        that.data.hdArr1[index].myOrder = 1;
        that.setData({
          hdArr1: that.data.hdArr1
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
  onPageScroll: function (e) {
    if (e.scrollTop >= 320) {
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
  setIndex: function (e) {
    let index = e.currentTarget.dataset.index;
    if(this.data.indexs == index){
      return
    }
    var that = this;
    this.setData({
      indexs: index,
      teamData:[],
      exampleData:[],
      activity:[],
      addressData:[],
      lecture:[],
      page:1
    },function(){
      //团队
      if (index == 0) {
        that.getTeamCustomerList();
      }
      //案例
      if (index == 1) {
        that.getExampletCustomerList();
      }
      //讲座
      if (index == 2) {
        that.getLectureList();
      }
      //活动
      if (index == 3) {
        that.getActivityList();
      }
      //办事处
      if (index == 4) {
        that.getAddressList();
      }
    })
  },
  //打电话
  phone: function (e) {
    console.log(e)
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  totaggle: function (e) {
    let index = e.currentTarget.dataset.index;
    var that = this;
    that.data.teamData[index].totaggle = true;
    that.setData({
      teamData: that.data.teamData
    })
  },
  setMap:function(){
      this.setData({
        map:!this.data.map
      })
  },
  /*查看讲座详情*/
  seeJzDetails:function(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/jzDetails/jzDetails?id='+id,
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
      //团队
      if (index == 0) {
        that.getCustomerList();
      }
      //案例
      if (index == 1) {
        that.getExampletCustomerList();
      }
      //讲座
      if (index == 2) {
        that.getLectureList();
      }
      //问答
      if (index == 3) {
        that.searchMeetCommentList();
      }
      //办事处
      if (index == 4) {
        that.getAddressList();
      }
      
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})