<template>
  <ul>
    <li @click="quitGroup">踢人</li>
  </ul>
</template>
<script>
  export default {
    props: ['groupMembersMenuPanelIndex', 'groupMembersItem', 'cache'],
    data () {
      return {
        delConfirmIndex: null
      }
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('closeGroupMembersMenu', function (msg) {
        _this.hide()
      })
      _this.$root.$(document).off('mousedown', _this.hide).on('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide).on('resize', _this.hide)
    },
    destroyed: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide)
      _this.$root.layer.close(_this.groupMembersMenuPanelIndex)
    },
    methods: {
      hide: function () {
        var _this = this
        _this.$destroy()
      },
      stopMousedown: function () {
      },
      quitGroup: function () {
        var _this = this
        _this.delConfirmIndex = _this.$root.layer.confirm('您确认踢掉群成员[' + _this.groupMembersItem.userName + ']？', {
          btn: ['确认', '取消']
        }, function () {
          _this.$root.$.ajax({
            type: 'post',
            url: _this.$root.webim_config.apiPath + 'group/kickGroup',
            data: JSON.stringify({
              uid: _this.cache.mine.id,
              groupImID: _this.cache.currentChatInfo.groupId,
              members: [_this.groupMembersItem]
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
                console.log('群成员已经被踢出')
              } else {
                _this.$root.layer.msg(data.msg)
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              _this.$root.layer.msg('群成员踢出失败')
            }
          })
          _this.$root.layer.close(_this.delConfirmIndex)
        }, function () {
          console.log('误点踢出群成员')
          console.log(_this.groupMembersItem)
        })
      }
    }
  }
</script>
<style>
</style>
