<template>
  <li @click="chat" class="groupFriendPanel" @contextmenu="menu($event)">
    <img :src="cache.msgAll[groupFriendItem.groupId].basicInfo.avatar">
    <span>{{ cache.msgAll[groupFriendItem.groupId].basicInfo.groupName }}</span>
    <p>{{ cache.msgAll[groupFriendItem.groupId].basicInfo.sign || '' }}</p>
    <span class="layim-msg-status" :class="cache.msgAll[groupFriendItem.groupId].unread > 0 ? 'layui-show' : ''" >{{ unread() }}</span>
  </li>
</template>
<script>
  import groupMenuPanel from './groupMenuPanel.vue'
  import Vue from 'vue'
  export default {
    props: ['groupFriendItem', 'cache'],
    data () {
      return {
        groupMenuPanelVue: null
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      chat: function () {
        var _this = this
        _this.$root.eventHub.$emit('chat', {
          groupId: _this.groupFriendItem.groupId
        })
      },
      unread: function () {
        var _this = this
        return _this.cache.msgAll[_this.groupFriendItem.groupId].unread > 999 ? '999+' : _this.cache.msgAll[_this.groupFriendItem.groupId].unread
      },
      menu: function (event) {
        var _this = this
        _this.$root.layer.tips('<div id="groupMenuPanelContainer"></div>', event.target, {
          tips: 1,
          time: 0,
          anim: 5,
          fix: true,
          skin: 'layui-box layui-layim-contextmenu',
          success: function (gccero, index) {
            _this.groupMenuPanelVue = new Vue({
              template: '<groupMenuPanel :groupMenuPanelIndex="groupMenuPanelIndex" :groupFriendItem="groupFriendItem" :type="type" :cache="cache"/>',
              components: { groupMenuPanel },
              data: {
                groupMenuPanelIndex: index,
                groupFriendItem: _this.groupFriendItem,
                cache: _this.cache,
                type: 1
              }
            })
            _this.groupMenuPanelVue.$mount('#groupMenuPanelContainer')
          }
        })
      }
    }
  }
</script>
<style>
  .groupFriendPanel {
  }
</style>
