<template>
  <li class="groupPanel">
    <ul class="layui-layim-list layui-show layim-list-group">
      <groupFriendPanel v-for="(groupFriendItem,key) in cache.group" :groupFriendItem="groupFriendItem" :cache="cache"></groupFriendPanel>
      <li v-if="cache.group.length === 0" class="layim-null" style="height:320px; line-height: 320px;" @contextmenu="menu($event)">暂无群组</li>
    </ul>
  </li>
</template>
<script>
  import groupMenuPanel from './groupMenuPanel.vue'
  import Vue from 'vue'
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
              template: '<groupMenuPanel :groupMenuPanelIndex="groupMenuPanelIndex" :type="type" :cache="cache"/>',
              components: { groupMenuPanel },
              data: {
                groupMenuPanelIndex: index,
                cache: _this.cache,
                type: 2
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
</style>
