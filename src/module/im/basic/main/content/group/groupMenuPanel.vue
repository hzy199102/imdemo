<template>
  <ul>
    <li v-if="type === 1 && groupFriendItem.uid !== cache.mine.id" @click="exitGroup">退出群组</li>
    <li v-if="type === 1 || type === 2" @click="createGroup">创建群组</li>
    <li v-if="type === 1 && groupFriendItem.uid === cache.mine.id" @click="delGroup">解散群组</li>
    <li v-if="type === 1 && groupFriendItem.uid === cache.mine.id" @click="inviteGroup">邀请群员</li>
  </ul>
</template>
<script>
  import Vue from 'vue'
  import createGroupPanel from './createGroupPanel.vue'
  export default {
    props: ['groupMenuPanelIndex', 'groupFriendItem', 'type', 'cache'],
    data () {
      return {
        delConfirmIndex: null,
        createGroupPanelVue: null,
        layimCreateGroup: null
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
      _this.$root.layer.close(_this.groupMenuPanelIndex)
    },
    methods: {
      hide: function () {
        var _this = this
        _this.$destroy()
      },
      stopMousedown: function () {
      },
      exitGroup: function () {
        console.log('退出群组')
      },
      delGroup: function () {
        console.log('解散群组')
        var _this = this
        _this.delConfirmIndex = _this.$root.layer.confirm('您确认解散群组[' + _this.groupFriendItem.groupName + ']？', {
          btn: ['确认', '取消']
        }, function () {
          _this.$root.$.ajax({
            type: 'post',
            url: _this.$root.webim_config.apiPath + 'group/disbandGroup',
            data: JSON.stringify({
              uid: _this.cache.mine.id,
              groupId: _this.groupFriendItem.groupId
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
                console.log(data)
                _this.$root.layer.msg('群组已经解散')
              } else {
                _this.$root.layer.msg(data.code + ':' + data.msg)
              }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              _this.$root.layer.msg('解散群组失败')
            }
          })
          _this.$root.layer.close(_this.delConfirmIndex)
        }, function () {
          console.log('误点解散群组')
        })
      },
      createGroup: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '创建群',
          shade: false,
          area: ['550px', '440px'],
          id: 'layui-layim-createGroup',
          skin: 'layui-box layui-layer-border pop-layui-layim-find',
          resize: false,
          content: '<div id="createGroupPanelContainer"></div>',
          success: function (layero, index) {
            _this.createGroupPanelVue = new Vue({
              template: '<createGroupPanel :cache="cache" :createGroupIndex="createGroupIndex" :type="type"/>',
              components: { createGroupPanel },
              data: {
                cache: _this.cache,
                createGroupIndex: index,
                type: 1
              }
            })
            _this.createGroupPanelVue.$mount('#createGroupPanelContainer')
            _this.layimCreateGroup = layero
            _this.resizeCreateGroup()
            _this.layimCreateGroup.on('contextmenu', function (event) {
              event.cancelBubble = true
              event.returnValue = false
              return false
            })
          },
          end: function () {
            _this.layimCreateGroup = null
            _this.$root.eventHub.$emit('closeCreateGroup', {})
          }
        })
      },
      inviteGroup: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '邀请群员',
          shade: false,
          area: ['550px', '440px'],
          id: 'layui-layim-createGroup',
          skin: 'layui-box layui-layer-border pop-layui-layim-find',
          resize: false,
          content: '<div id="createGroupPanelContainer"></div>',
          success: function (layero, index) {
            _this.createGroupPanelVue = new Vue({
              template: '<createGroupPanel :cache="cache" :createGroupIndex="createGroupIndex" :type="type" :groupId="groupId"/>',
              components: { createGroupPanel },
              data: {
                cache: _this.cache,
                createGroupIndex: index,
                type: 2,
                groupId: _this.groupFriendItem.groupId
              }
            })
            _this.createGroupPanelVue.$mount('#createGroupPanelContainer')
            _this.layimCreateGroup = layero
            _this.resizeCreateGroup()
            _this.layimCreateGroup.on('contextmenu', function (event) {
              event.cancelBubble = true
              event.returnValue = false
              return false
            })
          },
          end: function () {
            _this.layimCreateGroup = null
            _this.$root.eventHub.$emit('closeCreateGroup', {})
          }
        })
      },
      resizeCreateGroup: function () {

      }
    }
  }
</script>
<style>
</style>
