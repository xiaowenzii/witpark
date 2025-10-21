import {wxRequestPost, wxRequestGet} from "../../utils/util";

const app = getApp()
const codeKey = 1;
Page({
  data:{
    clientId: "e5cd7e4891bf95d1d19206ce24a7b32e",
    tenantId: "091894",
    checkCodeImage:'',
    uuid:'',
    account:'',
    password:''
  },
  login (data) {
    wx.switchTab({
      url: '../tab/home/home'
    })
    // var account = data.detail.value.account
    // var password = data.detail.value.password;
    // var checkCode = data.detail.value.checkCode;
    // if(account.length != 0 && password.length != 0 ){
    //   var parmas = { 
    //     username: account,
		// 		password: password,
		// 		clientId: that.clientId,
		// 		tenantId: that.tenantId,
		// 		grantType: "password",
		// 		code: checkCode,
		// 		uuid: that.uuid
    //   };
    //   wxRequestPost("/prod-api/auth/code", "登入中...", parmas, 'application/json', function(res) {
    //     console.log(res)
    //     if(res.data.success){
    //       // 全局缓存Token
    //       wx.setStorageSync('token', res.data.result.token);
    //       wx.setStorageSync('userInfo', res.data.result.userInfo);
    //       wx.setStorageSync('account', account);
    //       wx.setStorageSync('password', password);
    //       wx.switchTab({
    //         url: '../tab/home/home'
    //       })
    //     }else{
    //       wx.showToast({
    //         icon: "none",
    //         title: (res.data.message)
    //       });
    //     }
    //   }, function(error) {})
    // } else {
    //   wx.showToast({
    //     title: '请输入账号密码！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    // }
  },
  //清空输入的账号
  claerAccount () {
    this.setData({
      account: ''
    });
  },
  getKeyCodeImage(){
    const that = this;
    wxRequestGet("/prod-api/auth/code", "获取验证码...", {}, 'application/x-www-form-urlencoded', function(res) {
      if(res.code=='200'){
        var baseImage = 'data:image/png;base64,'+res.data.img;
        that.setData({
          checkCodeImage: baseImage,
          uuid: res.data.uuid
        })
      }
    }, function(error) {})
  },
  reloadImage(){
    this.getKeyCodeImage();
  },
  onReady() {
    this.setData({
      account: wx.getStorageSync('account'),
      password: wx.getStorageSync('password')
    })
    this.getKeyCodeImage();
  }
})
