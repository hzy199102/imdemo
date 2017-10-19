/**
 *
 * @type {{connMap: {}, connStatus: boolean}}
 */
window.imdemo = {
    /**
     * websocket请求
     * 有些websocket请求需要处理回调信息，因为是异步操作，为了正确找到对应的每个websocket请求，
     * 根据value中的type做出正确的响应操作
     * key:headSeqId,对应response.seqid
     * value:
     *      type:自定义处理类型
     *      id:聊天对象id
     */
    connMap : {},
    /**
     * websocket连接场景，是否断网重连场景
     */
    connStatus : false
};


/**
 * 入口服务
 * @type {Utils}
 */
imdemo.utils = new Utils();
imdemo.utils.listen({
    /**
     * 抛出异常
     * @param data
     * data.code 异常编号
     * data.message 异常官方提示信息，带有这样提示信息的code一般不做处理
     * data.data 异常信息
     */
    onError: function (data) {
        switch (data.code) {
          // websocket关闭
          case webim_code.WEBIM_ERROR_ONCLOSE:
            console.log('websocket关闭');
            if (imdemo.conn.type === 2) {
              console.log('扫码websocket关闭');
              $('body').trigger('onError_105', {});
            }
            break;
          default:
            console.log(data);
        }
    },
    //入口服务回调
    onEnter: function () {
      initDemo();
      //ws://192.168.67.67:8088/ws
      webim_config.xmppURL = "ws://192.168.67.67:8088/ws"
      $('body').trigger('onEnter', {});
    }
});

imdemo.utils.initConfig();

var initDemo = function(){
  //webim_config.xmppURL = 'ws://192.168.67.67:80888/ws'
  imdemo.conn = new Connection({
      "utils": imdemo.utils
  });
  imdemo.conn.listen({
    //连接成功回调
    onOpened: function () {
      console.log("websocket连接成功");
    },
    //消息发送超时回调
    onMessageTimeoutCallback: function (response) {
      switch (response.cmd) {
        // 301登录请求
        case webim_code.WEBIM_LOGIN_MSG:
          console.log("登录请求超时");
          break;
        // 302登出请求
        case webim_code.WEBIM_LOGOUT_MSG:
          console.log("登出请求超时");
          break;
        // 303发送消息请求
        case webim_code.WEBIM_SEND_MSG:
          console.log("发送消息请求超时");
          $('body').trigger('onMessageTimeoutCallback_303', response);
          break;
        // 304拉取会话请求
        case webim_code.WEBIM_SESSION_MSG:
          console.log("拉取会话请求超时");
          break;
        // 305拉取消息请求
        case webim_code.WEBIM_OFFLINE_MSG:
          console.log("拉取消息请求超时");
          break;
        // 306上报阅读消息最大编号请求
        case webim_code.WEBIM_READED_MAXVER_MSG:
          console.log("上报阅读消息最大编号请求超时");
          break;
        // 307send消息已读回执
        case webim_code.WEBIM_READED_COMFIRM_MSG:
          console.log("send消息已读回执超时");
          break;
        // 308拉取附近的人
        case webim_code.WEBIM_GET_NEAR_PERSION_MSG:
          console.log("拉取附近的人超时");
          break;
        // 309上报位置信息
        case webim_code.WEBIM_POST_GPS_MSG:
          console.log("上报位置信息超时");
          break;
        // 399透传信息
        case webim_code.WEBIM_TRANSPREANT_MSG:
          console.log("透传信息超时");
          break;
        default:
          console.log("未知命令：" + response.cmd);
      }
    },
    //扫码登录成功回调
    onSaomaLoginSuccessedCallback: function (response) {
      console.log("扫码登录成功");
      $('body').trigger('onSaomaLoginSuccessedCallback', response);
    },
    //登录成功回调
    onLoginSuccessedCallback: function (response) {
      console.log("登录成功回调");
      debugger
      $('body').trigger('onLoginSuccessedCallback', response);
    },
    //登录失败回调
    onLoginFailedCallback: function (response) {
      debugger
      console.log("登录失败！请检查账户和密码是否正确！");
    },
    //登出回调
    onLogoutCallback: function (response) {
      console.log("登出成功");
    },
    //文字发送回调
    onTextMessageAnswerCallback: function (response) {
      console.log("文字发送回调");
      $('body').trigger('onTextMessageAnswerCallback', response);
    },
    //文字接收回调
    onTextMessageReceiveCallback: function (response) {
      console.log("文字接收回调");
      $('body').trigger('onTextMessageReceiveCallback', response);
    },
    //拉取会话请求回包回调
    onPullSessionCallback: function (response) {
      console.log("拉取会话请求回包应答");
      if (imdemo.connMap[response.seqid].type === 1) {
        console.log("页面初始化拉取会话请求应答");
        $('body').trigger('onPullSessionCallback_1', response);
      } else if (imdemo.connMap[response.seqid].type === 2) {
        console.log("拉取指定会话请求应答");
        $('body').trigger('onPullSessionCallback_2', response);
      }
    },
    //拉取消息请求回包回调
    onPullMsgCallback: function (response) {
      console.log("拉取消息请求回包回调");
      if (imdemo.connMap[response.seqid].type === 1) {
        $('body').trigger('onPullMsgCallback_1', response);
      }
    },
    //上报阅读消息最大编号回包回调
    onPostReadSeqCallback: function (response) {
      console.log("上报阅读消息最大编号回包回调");
      $('body').trigger('onPostReadSeqCallback', response);
    },
    //send消息已读回执回包回调
    onPostReadConfirmCallback: function (response) {
      console.log("send消息已读回执回包回调");
    },
    //拉取附近的人回包回调
    onGetNearPersonCallback: function (response) {
      console.log("拉取附近的人回包回调");
    },
    //上报位置信息回包回调
    onPostGPSCallback: function (response) {
      console.log("上报位置信息回包回调");
    },
    //透传信息回包回调
    onRouteMsgCallback: function (response) {
      console.log("透传信息回包");
    },
    //系统透传信息接收回调
    onPushSystemProtocolCallback: function (response) {
      console.log("系统透传信息接收回调");
      console.log(response)
    },
    //自定义透传信息接收回调
    onPushCustomProtocolCallback: function (response) {
      console.log("自定义透传信息接收回调");
      if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_REQUEST_ADD_FRIEND) {
        console.log("邀请加为好友通知");
        $('body').trigger('onPushCustomProtocolCallback_1', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_DELETE_FRIEND) {
        console.log("删除好友通知");
        $('body').trigger('onPushCustomProtocolCallback_2', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_AGREE_ADD_FRIEND) {
        console.log("添加好友通知");
        $('body').trigger('onPushCustomProtocolCallback_3', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_CREATE_GROUP_SUCCEED) {
        console.log("群组创建通知");
        $('body').trigger('onPushCustomProtocolCallback_5', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_DELETE_GROUP) {
        console.log("群组解散通知");
        $('body').trigger('onPushCustomProtocolCallback_6', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_GROUP_KICKED_MEMBER) {
        console.log("群员踢出通知");
        $('body').trigger('onPushCustomProtocolCallback_9', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_GROUP_ADD_MEMBER) {
        console.log("群员入群通知");
        $('body').trigger('onPushCustomProtocolCallback_11', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_SAOMA_SUCCESS) {
        console.log("扫码成功");
        $('body').trigger('onPushCustomProtocolCallback_65', response);
      } else if (response.msgBody.Cmd == webim_code.WEBIM_CUSTOM_SAOMA_LOGIN_SUCCESS) {
        console.log("扫码登录成功");
        $('body').trigger('onPushCustomProtocolCallback_66', response);
      }else {
        console.log(response);
      }
    },
    //连接关闭回调
    onClosed: function ( message ) {
      console.log("连接关闭！");
    }
  });
}

/**
 * 页面关闭的时候
 */
window.onbeforeunload = function() {
  $('body').trigger('onbeforeunload_im', {});
}
//debugger
//webim_config.xmppURL = "ws://192.168.67.67:8088/ws" //消息服务器
//initDemo();
//$('body').trigger('onEnter', {});
