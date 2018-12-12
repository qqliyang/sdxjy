function request(type, url, params, success, fail) {
  this.requestLoading(type, url, params, "", success, fail)
}
// 展示进度条的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
// fail：失败的回调
function requestLoading(type, url, params, message, success, fail) {
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      if (res.networkType == 'none') {
        wx.showModal({
          title: '温馨提示',
          content: '当前暂无网络连接，请确定网络通顺后再次使用',
          showCancel: false
        })
      }
      else {
        wx.showNavigationBarLoading()
        if (message != "") {
          wx.showLoading({
            title: message,
          })
        }
        wx.request({
          url: url,
          data: params,
          header: {
            //'Content-Type': 'application/json'
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: type,
          success: function (res) {

            wx.hideNavigationBarLoading()
            if (message != "") {
              wx.hideLoading()
            }
            if (res.data.resultCode == '0000') {
              success(res.data)
            }
            // else if (res.data.code == '1002') {
            //   try {
            //     wx.clearStorageSync();
            //     wx.redirectTo({
            //       url: '/pages/login/login?redirect=1',
            //     })
            //     return false
            //   } catch (e) {
            //     // Do something when catch error
            //   }

            // }
            else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          },
          fail: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
              wx.hideLoading()
            }

            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          },
          complete: function (res) {

          },
        })
      }
    }
  })



}
module.exports = {
  request: request,
  requestLoading: requestLoading
}