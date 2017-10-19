<template>
  <li class="groupPanel">
    <ul class="layui-layim-list layui-show layim-list-group">
      <li v-if="cache.group.length === 0" class="layim-null" style="height:320px; line-height: 320px;" @contextmenu="menu($event, 2, null)">暂无群组</li>
      <groupFriendPanel v-for="(groupFriendItem,key) in cache.group" :groupFriendItem="groupFriendItem" :cache="cache"></groupFriendPanel>
    </ul>
  </li>
</template>
<script>
  import Vue from 'vue'
  import groupMenuPanel from './groupMenuPanel.vue'
  import groupFriendPanel from './groupFriendPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
      groupFriendPanel
    },
    created: function () {
    },
    methods: {
      chat: function (groupFriendItem) {
        var _this = this
        _this.$root.eventHub.$emit('chat', {
          groupId: groupFriendItem.groupId
        })
      },
      unread: function (groupFriendItem) {
        var _this = this
        return _this.cache.msgAll[groupFriendItem.groupId].unread > 999 ? '999+' : _this.cache.msgAll[groupFriendItem.groupId].unread
      },
      menu: function (event, type, groupFriendItem) {
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
                groupFriendItem: groupFriendItem,
                cache: _this.cache,
                type: type
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
  .groupPanel {
  }
  .groupFriendPanel {
  }
</style>
