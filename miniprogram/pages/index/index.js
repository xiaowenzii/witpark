import {wxRequest} from "../../utils/util";

const app = getApp()
Page({
  login (data) {
    var account = data.detail.value.account
    var password = data.detail.value.password;
    if(account.length != 0 && password.length != 0 ){
      // wxRequest({key:"key", url:"/sps/sys/randomImage"})
      // .then((res) => {
      //   console.log(res);
      // })
      wx.switchTab({
        //跳转至 Home 页面
        url: '../tab/home/home'
      })
    } else {
      wx.showToast({
        title: '请输入账号密码！',
        icon: 'none',
        duration: 1500
     })
    }
  },
  //清空输入的账号
  claerAccount () {
    this.setData({
      account: ''
    });
  }
})
