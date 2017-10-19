<template>
  <div class="sendAddFriendPanel">
    <div class="info">
      <img :src="findFriendItem.avatar">
      <div :title="findFriendItem.userName" style="margin-top: 10px; margin-left: 10px;">{{ findFriendItem.userName }}</div>
      <div :title="findFriendItem.mobile" style="margin-top: 5px; margin-left: 10px;">{{ findFriendItem.mobile }}</div>
    </div>
    <div style="width: 310px; height: 100%; float: right;">
      <div style="margin-top: 15px;">请输入验证信息:</div>
      <textarea name="desc" placeholder="请输入验证内容" class="layui-textarea" style="margin-top: 10px; width: 300px; resize:none; min-height: 70px; height: 70px"></textarea>
      <button class="layui-btn layui-btn-small layui-btn-normal" style=" bottom: 10px; position: fixed; right: 10px;" @click="sendAddFriend">发送</button>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['findFriendItem', 'cache', 'layimSendAddFriendIndex'],
    data () {
      return {
      }
    },
    components: {
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('closeSendAddFriend', function (msg) {
        _this.$destroy()
      })
    },
    methods: {
      sendAddFriend: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'friend/addFriend',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            friendUid: _this.findFriendItem.imUserID
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
              _this.$root.layer.msg(data.msg || '好友申请已经发出')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
            _this.$root.layer.close(_this.layimSendAddFriendIndex)
          }
        })
      }
    },
    destroyed: function () {
    }
  }
</script>
<style>
  .sendAddFriendPanel {
  }
  .sendAddFriendPanel .info {
    width: 150px;
    height: 100%;
    float: left;
  }
  .sendAddFriendPanel .info img {
    width: 110px;
    height: 110px;
    margin-left: 10px;
    margin-top: 35px;
  }
</style>
