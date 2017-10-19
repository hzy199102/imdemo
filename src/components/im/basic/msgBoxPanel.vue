<template>
  <ul class="layim-msgbox msgBoxPanel">
    <div v-for="(msgBoxItem,key) in cache.msgBox">
      <li v-if="msgBoxItem.type === 'addFriend'">
        <a href="javascript:void(0);" @click="showFriendInfo(msgBoxItem)">
          <img :src="msgBoxItem.avatar" class="layui-circle layim-msgbox-avatar">
        </a>
        <p class="layim-msgbox-user">
          <a href="javascript:void(0);" @click="showFriendInfo(msgBoxItem)">{{ msgBoxItem.userName }}</a>
          <span>刚刚</span>
        </p>
        <p class="layim-msgbox-content">
          {{ msgBoxItem.msgBoxContent }}
          <span>{{ msgBoxItem.remark ? '附言: ' + msgBoxItem.remark : '附言: 无' }}</span>
        </p>
        <p class="layim-msgbox-btn">
          <button class="layui-btn layui-btn-small" @click="agreeFriend(msgBoxItem)">同意</button>
          <button class="layui-btn layui-btn-small layui-btn-primary" @click="refuseFriend(msgBoxItem)">拒绝</button>
        </p>
      </li>
    </div>
    <li v-if="cache.msgBox.length === 0" class="layim-msgbox-tips">暂无更多新消息</li>
  </ul>
</template>
<script>
  export default {
    props: ['cache'],
    data () {
      return {
        tabStatus: 1
      }
    },
    components: {
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('closeMsgBox', function (msg) {
        _this.$destroy()
      })
    },
    methods: {
      showFriendInfo: function (msgBoxItem) {
        console.log(msgBoxItem)
      },
      agreeFriend: function (msgBoxItem) {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'friend/auditFriend',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            friendUid: msgBoxItem.friendImID,
            status: 1
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
              console.log('审核添加好友成功')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
          }
        })
      },
      refuseFriend: function (msgBoxItem) {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'friend/auditFriend',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            friendUid: msgBoxItem.friendImID,
            status: 0
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
              console.log('审核拒绝添加好友成功')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
            var msgBoxPosition = -1
            for (var i = 0; i < _this.cache.msgBox.length; i++) {
              if (_this.cache.msgBox[i].groupId === msgBoxItem.groupId) {
                msgBoxPosition = i
                break
              }
            }
            _this.cache.msgBox.splice(msgBoxPosition, 1)
          }
        })
      }
    },
    destroyed: function () {
      var _this = this
      console.log(_this)
    }
  }
</script>
<style>
  .msgBoxPanel {
  }
  .layim-msgbox{margin: 15px;}
  .layim-msgbox li{position: relative; margin-bottom: 10px; padding: 0 130px 10px 60px; padding-bottom: 10px; line-height: 22px; border-bottom: 1px dotted #e2e2e2;}
  .layim-msgbox .layim-msgbox-tips{margin: 0; padding: 10px 0; border: none; text-align: center; color: #999;}
  .layim-msgbox .layim-msgbox-system{padding: 0 10px 10px 10px;}
  .layim-msgbox li p span{padding-left: 5px; color: #999;}
  .layim-msgbox li p em{font-style: normal; color: #FF5722;}

  .layim-msgbox-avatar{position: absolute; left: 0; top: 0; width: 50px; height: 50px;}
  .layim-msgbox-user{padding-top: 5px;}
  .layim-msgbox-content{margin-top: 3px;}
  .layim-msgbox .layui-btn-small{padding: 0 15px; margin-left: 5px;}
  .layim-msgbox-btn{position: absolute; right: 0; top: 12px; color: #999;}
</style>
