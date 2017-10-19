<template>
  <ul>
    <li @click="removeFriend">删除好友</li>
    <li @click="updateRemark">修改备注（暂无）</li>
  </ul>
</template>
<script>
  export default {
    props: ['friendMenuPanelIndex', 'friendFriendItem', 'cache'],
    data () {
      return {
        delConfirmIndex: null
      }
    },
    created: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide).on('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide).on('resize', _this.hide)
    },
    destroyed: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide)
      _this.$root.layer.close(_this.friendMenuPanelIndex)
    },
    methods: {
      hide: function () {
        var _this = this
        _this.$destroy()
      },
      stopMousedown: function () {
      },
      removeFriend: function () {
        var _this = this
        _this.delConfirmIndex = _this.$root.layer.confirm('您确认删除好友[' + _this.friendFriendItem.userName + ']？', {
          btn: ['确认', '取消']
        }, function () {
          _this.$root.$.ajax({
            type: 'post',
            url: _this.$root.webim_config.apiPath + 'friend/delFriend',
            data: JSON.stringify({
              uid: _this.cache.mine.id,
              friendUid: _this.friendFriendItem.friendImID
            }),
            contentType: 'application/json',
            dataType: 'json',
            async: false,
            xhrFields: {
              // withCredentials: true
            },
            beforeSend: function (request) {
              request.setRequestHeader('appID', _this.$root.webim_config.appId)
            },
            success: function (data) {
              if (data.code === 1) {
                console.log('删除好友成功')
                _this.$root.eventHub.$emit('removeFriend', {
                  groupId: _this.$root.imdemo.conn.generateRouteid(_this.cache.mine.id, _this.friendFriendItem.friendImID)
                })
              } else {
                _this.$root.layer.msg(data.msg)
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              _this.$root.layer.msg('删除失败')
            }
          })
          _this.$root.layer.close(_this.delConfirmIndex)
        }, function () {
          console.log('误点删除好友')
        })
      },
      updateRemark: function () {
        console.log('修改备注')
      }
    }
  }
</script>
<style>
</style>
