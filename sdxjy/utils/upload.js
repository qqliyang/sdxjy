//多张图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'fileData',
        formData: data.formData,//这里是上传图片时一起上传的数据
        success: (resp) => {
          console.log("上传成功了")
          if(resp.data.resultecode == "0000"){
            success++;
          }
          //后台返回过来的状态码为成功时，这里的success才+1
        },
        fail: (res) => {
          fail++;
          console.log('fail:' + i + "fail:" + fail);
        },
        complete: (res) => {
          console.log(i);
          i++; //这个图片执行完上传后，开始上传下一张
          if (i == data.path.length) { //当图片传完时，停止调用  
            console.log('执行完毕', JSON.parse(res.data));
            console.log('成功：' + success + " 失败：" + fail);
            // 返回到上一页
            if (JSON.parse(res.data).resultCode == "0000"){
                wx.showToast({
                  title: '提交成功',
                  duration: 3000
                });
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1000);
            }
            else{
              wx.showToast({
                title: JSON.parse(res.data).message,
                duration: 3000
              });
            }
          } else {//若图片还没有传完，则继续调用函数
            console.log(i);
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadimg(data);
          }
        }
  });
}
// 暴露方法
module.exports = {
  uploadimg: uploadimg
}