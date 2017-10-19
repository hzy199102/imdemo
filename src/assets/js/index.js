/**
 *
 * @type {{connStatus: boolean}}
 */
window.imdemo = {
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
      // webim_config.xmppURL = "ws://192.168.67.67:8088/ws"
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
    //文字接收回调
    onTextMessageReceiveCallback: function (response) {
      console.log("文字接收回调");
      $('body').trigger('onTextMessageReceiveCallback', response);
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
window.onresize = function () {
  $('body').trigger('onresize_logPanel', {})
}
