<template>
  <div class="login" :style="loginRootStyle">
    <div id="layout-container">
      <div id="body">
        <div class="login-form tab login-tab">
          <ul class="tab-items">
            <li class="tab-item" :class="loginType === 1 ? 'current' : ''" @click="showQrcodePanel">扫码登录</li>
            <li class="tab-item" :class="loginType === 2 ? 'current' : ''" @click="showAccountPanel">密码登录</li>
          </ul>
          <div class="tab-contents" :class="loginType === 1 ? 'show_flex' : 'hide'">
            <div class="tab-content qrcode-login current">
              <p class="brem" :class="bremStatus? 'show' : 'hide'">
                <span>{{ spanInfo2 }}</span>
              </p>
              <div class="qrcode-wrapper">
                <div id="qrcode-img" class="qrcode-img qrcode">
                  <!--<canvas width="170" height="170" style="display: none !important;"></canvas>-->
                  <!--<img alt="扫我!" src="" style="display: block !important;">-->
                </div>
                <span class="loading" :class="loadingStatus? 'show' : 'hide'">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                </span>
                <div class="qr-mask" :class="qrcodeStatus? 'hide' : 'show'"></div>
                <span class="err-info" :class="qrcodeStatus? 'hide' : 'show'">您的二维码已经失效，请点击下方的刷新按钮</span>
              </div>
              <p class="rem">
                <span>{{ spanInfo }}</span>
                <a class="refresh-qrcode" href="javascript:void(0);" @click="refreshQrcode"  :class="stopClick? 'stopClick' : ''">
                  <i class="iconfont">&#xe636;</i>
                  <span class="">刷新</span>
                </a>
              </p>
              <span class="account-menus ">
                <a href="javascript:void(0);" @click="showRegisterPanel">
                  <span>新用户注册</span>
                </a>
              </span>
            </div>
          </div>
          <div class="tab-contents" :class="loginType === 2 ? 'show_flex' : 'hide'">
            <div class="tab-content password-login current">
              <div class="avatar-halo"></div>
              <div class="avatar biger border-thick ">
                <img src="../../assets/img/logo_im.png" class="country-img" alt="">
              </div>
              <div class="clearfix">
                <input class="fm-input telephone" type="text" placeholder="请输入手机号" v-model="login_telephone">
              </div>
              <div class="clearfix">
                <input class="fm-input password" type="password" placeholder="请输入密码" v-model="login_password">
              </div>
              <button type="submit" class="blue big" @click="login">登录</button>
              <span class="account-menus">
                  <a href="javascript:void(0);" @click="showRegisterPanel">
                    <span>新用户注册</span>
                  </a>
                <!--<a href="#" class="">-->
                <!--<span class="click-wangjimima">忘记密码</span>-->
                <!--</a>-->
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ding-modal fade in" style="z-index: 1050;"  :class="showRegsisterPanel ? 'show' : ''">
      <div class="modal-content">
        <div class="user-register-dialog ">
          <div class="content">
            <div class="head">
              <i class="iconfont close"  @click="closeRegisterPanel"></i>
              <span class="title ">注册</span>
            </div>
            <div class="body login-form">
              <div class="ver-login">
                <div class="avatar-halo"></div>
                <div class="avatar biger border-thick">
                  <img src="../../assets/img/logo_im.png" class="country-img" alt="">
                </div>
                <div class="clearfix">
                  <input type="text" placeholder="请输入手机号" class="fm-input ver-code" v-model="zc_telephone">
                </div>
                <div class="clearfix">
                  <input type="text" placeholder="请输入用户名" class="fm-input ver-code" v-model="zc_username">
                </div>
                <div class="clearfix">
                  <input type="password" placeholder="请输入密码" class="fm-input password" v-model="zc_psd">
                </div>
                <div class="clearfix">
                  <input type="password" placeholder="请再次输入密码" class="fm-input password" v-model="zc_rpsd">
                </div>
                <button class="blue big" @click="register">登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//  import '../../assets/css/app.css'
  export default {
    data () {
      return {
        spanInfo: '请使用云通讯扫描二维码登录',
        spanInfo2: '扫码成功',
        stopClick: false,
        stopClickTime: 3 * 1000,
        refreshQrcodeStatus: false,
        websocket: false,
        qrcodeStatus: true,
        loadingStatus: true,
        bremStatus: false,
        showRegsisterPanel: false,
        loginType: 1,
        login_telephone: '',
        login_password: '',
        zc_telephone: '',
        zc_username: '',
        zc_psd: '',
        zc_rpsd: '',
        loginRootStyle: {
        }
      }
    },
    components: {
    },
    created: function () {
      var _this = this
//      _this.loginRootStyle.height = window.innerHeight + 'px'
//      window.onresize = function () {
//        _this.loginRootStyle.height = window.innerHeight + 'px'
//      }
      if (typeof _this.$root.imdemo.conn !== 'undefined') {
        _this.$root.imdemo.conn.type = 2
        _this.refreshQrcode()
      }
      _this.$root.$('body').off('onEnter')
      _this.$root.$('body').on('onEnter', function (e, response) {
        _this.$root.imdemo.conn.type = 2
        _this.qrcodeLogin()
        _this.initLoginUI = true
      })
      _this.$root.$('body').off('onError_105')
      _this.$root.$('body').on('onError_105', function (e, response) {
        if (_this.refreshQrcodeStatus) {
          /**
           * 主动点击二维码刷新按钮，重新建立扫码websocket的连接
           */
          _this.qrcodeLogin()
        } else {
          /**
           * 二维码失效
           */
          _this.qrcodeStatus = false
          _this.websocket = false
        }
      })
      _this.$root.$('body').off('onSaomaLoginSuccessedCallback')
      _this.$root.$('body').on('onSaomaLoginSuccessedCallback', function (e, response) {
        _this.loadingStatus = false
        _this.refreshQrcodeStatus = false
        _this.websocket = true
        _this.generatetime = new Date().getTime()
        var url = 'http://im-demo.glodon.com/action/login?appid=' + _this.$root.webim_config.appKey + '&code=' + _this.userCode + '&generatetime=' + _this.generatetime
        _this.$root.$('#qrcode-img').qrcode({
          render: 'canvas',
          text: url,
          height: 170,
          width: 170
        })
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_65')
      _this.$root.$('body').on('onPushCustomProtocolCallback_65', function (e, response) {
        var info = _this.$root.$.parseJSON(response.msgBody.MsgBody)
        _this.$root.$('#qrcode-img').html('<img width="170" height="170" src="' + info.avatar + '">')
        _this.bremStatus = true
        _this.spanInfo2 = '扫码成功'
        _this.spanInfo = '请在手机上点击确认以登录'
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_66')
      _this.$root.$('body').on('onPushCustomProtocolCallback_66', function (e, response) {
        var info = _this.$root.$.parseJSON(response.msgBody.MsgBody)
        localStorage.setItem('imUserID', data.data.imUserID)
        localStorage.setItem(info.imUserID, info.password)
        _this.$root.imdemo.conn.type = 1
        _this.$router.push('/im')
      })
    },
    methods: {
      qrcodeLogin: function () {
        var _this = this
        _this.userCode = _this.$root.imdemo.conn.getUniqueId().replace(/-/g, '')
        _this.$root.imdemo.conn.open({
          userCode: _this.userCode,
          token: _this.userCode
        })
      },
      showRegisterPanel: function () {
        var _this = this
        _this.showRegsisterPanel = true
      },
      closeRegisterPanel: function () {
        var _this = this
        _this.showRegsisterPanel = false
        _this.zc_telephone = ''
        _this.zc_username = ''
        _this.zc_psd = ''
        _this.zc_rpsd = ''
      },
      showQrcodePanel: function () {
        var _this = this
        _this.loginType = 1
        _this.refreshQrcode()
      },
      showAccountPanel: function () {
        var _this = this
        _this.loginType = 2
      },
      refreshQrcode: function () {
        var _this = this
        if (_this.stopClick) {
          return false
        }
        // 一定时间间隔内禁止重复点击刷新
        setTimeout(function () {
          _this.stopClick = false
        }, _this.stopClickTime)
        _this.stopClick = true
        _this.$root.$('#qrcode-img').html('')
        _this.spanInfo = '请使用云通讯扫描二维码登录'
        _this.refreshQrcodeStatus = true
        _this.qrcodeStatus = true
        _this.loadingStatus = true
        _this.bremStatus = false
        if (_this.websocket) {
          _this.$root.imdemo.conn.closeConn()
        } else {
          _this.qrcodeLogin()
        }
      },
      login: function () {
        var _this = this
        if (_this.login_telephone === '') {
          _this.$root.layer.msg('请输入手机号')
          return false
        }
        if (_this.login_password === '') {
          _this.$root.layer.msg('请输入密码')
          return false
        }
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'user/login',
          data: JSON.stringify({
            mobile: _this.login_telephone,
            password: _this.login_password
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              localStorage.setItem('imUserID', data.data.imUserID)
              localStorage.setItem(data.data.imUserID, _this.login_password)
              // window.location.href = '/webimp/index.html?id=' + data.data.imUserID
              console.log(data.data.imUserID)
              _this.$root.imdemo.conn.type = 1
              _this.$router.push('/im')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
          }
        })
      },
      register: function () {
        var _this = this
        if (_this.zc_telephone === '') {
          _this.$root.layer.msg('请输入手机号')
          return false
        }
        if (_this.zc_username === '') {
          _this.$root.layer.msg('请输入用户名')
          return false
        }
        if (_this.zc_psd === '') {
          _this.$root.layer.msg('请输入密码')
          return false
        }
        if (_this.psd !== _this.rpsd) {
          _this.$root.layer.msg('确认密码不一致')
          return false
        }
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'user/register',
          data: JSON.stringify({
            userName: _this.zc_username,
            mobile: _this.zc_telephone,
            nickName: _this.zc_username,
            gender: 1,
            password: _this.zc_psd
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.status) {
              localStorage.setItem('imUserID', data.data.imUserID)
              localStorage.setItem(data.data.imUserID, _this.zc_psd)
              _this.$root.imdemo.conn.type = 1
              _this.$router.push('/im')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
          }
        })
      }
    }
  }
</script>
<style src="../../assets/css/app.css" scoped></style>
<style scoped>
  .login {
    height: 100%;
    background:url("../../assets/img/main-bg.png") no-repeat #5a83b7;
    background-size:cover
  }
  .login .stopClick {
    color: #b4b4b4 !important;
    cursor: not-allowed;
  }
  .login .login-form .qrcode-login .brem {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    color: #b4b4b4;
  }
  .login .brem span {
    font-size: 20px !important;
    color: rebeccapurple !important;
  }
  .login a, .link {
    text-decoration: none !important;
    color: #38adff !important;
  }
</style>
