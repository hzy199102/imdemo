<template>
  <li @click="chat" class="friendFriendPanel" @contextmenu="menu($event)">
    <img :src="cache.msgAll[friendFriendItem.groupId].basicInfo.avatar">
    <span>{{ cache.msgAll[friendFriendItem.groupId].basicInfo.userName }}</span>
    <p>{{ cache.msgAll[friendFriendItem.groupId].basicInfo.sign || '' }}</p>
    <span class="layim-msg-status" :class="cache.msgAll[friendFriendItem.groupId].unread > 0 ? 'layui-show' : ''">{{ unread() }}</span>
  </li>
</template>
<script>
  import friendMenuPanel from './friendMenuPanel.vue'
  import Vue from 'vue'
  export default {
    props: ['friendFriendItem', 'cache', 'type'],
    data () {
      return {
        friendMenuPanelVue: null
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      chat: function () {
        var _this = this
        if (_this.type !== 1) {
          return false
        }
        console.log('左键功能只提供于主面板中')
        _this.$root.eventHub.$emit('chat', {
          groupId: _this.friendFriendItem.groupId
        })
      },
      unread: function () {
        var _this = this
        return _this.cache.msgAll[_this.friendFriendItem.groupId].unread > 999 ? '999+' : _this.cache.msgAll[_this.friendFriendItem.groupId].unread
      },
      menu: function (event) {
        var _this = this
        if (_this.type !== 1) {
          return false
        }
        console.log('右键功能只提供于主面板中')
        _this.$root.layer.tips('<div id="friendMenuPanelContainer"></div>', event.target, {
          tips: 1,
          time: 0,
          anim: 5,
          fix: true,
          skin: 'layui-box layui-layim-contextmenu',
          success: function (gccero, index) {
            _this.friendMenuPanelVue = new Vue({
              template: '<friendMenuPanel :friendMenuPanelIndex="friendMenuPanelIndex" :friendFriendItem="friendFriendItem" :cache="cache"/>',
              components: { friendMenuPanel },
              data: {
                friendMenuPanelIndex: index,
                friendFriendItem: _this.friendFriendItem,
                cache: _this.cache
              }
            })
            _this.friendMenuPanelVue.$mount('#friendMenuPanelContainer')
          }
        })
      }
    }
  }
</script>
<style>
  .friendFriendPanel {
  }
</style>
