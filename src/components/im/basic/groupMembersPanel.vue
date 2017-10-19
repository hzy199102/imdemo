<template>
  <ul class="layim-members-list" @mousedown.stop="stopMousedown">
    <li v-for="(groupMembersItem,i) in cache.msgAll[groupId].basicInfo.members" @click.stop="chat" @contextmenu="menu($event, groupMembersItem)">
      <a href="javascript:;"><img :src="groupMembersItem.avatar"><cite>{{ groupMembersItem.userName }}</cite></a>
    </li>
  </ul>
</template>
<script>
  import groupMembersMenuPanel from './groupMembersMenuPanel.vue'
  import Vue from 'vue'
  export default {
    props: ['groupMembersPanelIndex', 'groupId', 'cache'],
    data () {
      return {
        groupMembersMenuPanelVue: null
      }
    },
    created: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide).on('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide).on('resize', _this.hide)
      _this.eventHub.$on('closeGroupMembers2', function (msg) {
        _this.$destroy()
      })
    },
    destroyed: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide)
      _this.$root.layer.close(_this.groupMembersPanelIndex)
    },
    methods: {
      hide: function () {
        var _this = this
        _this.$root.eventHub.$emit('closeGroupMembers', {
          groupId: _this.groupId
        })
        _this.$destroy()
      },
      stopMousedown: function () {
        var _this = this
        _this.$root.eventHub.$emit('closeGroupMembersMenu', {})
      },
      chat: function () {
        console.log('groupMembers.chat')
      },
      menu: function (event, groupMembersItem) {
        var _this = this
        if (groupMembersItem.imUserID === _this.cache.mine.id || _this.cache.msgAll[_this.groupId].basicInfo.uid !== _this.cache.mine.id) {
          console.log('非群主或者群主点击自己头像都不能打开右键菜单')
          return false
        }
        _this.$root.layer.tips('<div id="groupMembersMenuPanelContainer"></div>', event.target, {
          tips: 1,
          time: 0,
          anim: 5,
          tipsMore: true,
          fix: true,
          skin: 'layui-box layui-layim-contextmenu',
          success: function (gccero, index) {
            _this.groupMembersMenuPanelVue = new Vue({
              template: '<groupMembersMenuPanel :groupMembersMenuPanelIndex="groupMembersMenuPanelIndex" :groupMembersItem="groupMembersItem" :cache="cache"/>',
              components: { groupMembersMenuPanel },
              data: {
                groupMembersMenuPanelIndex: index,
                groupMembersItem: groupMembersItem,
                cache: _this.cache
              }
            })
            _this.groupMembersMenuPanelVue.$mount('#groupMembersMenuPanelContainer')
          }
        })
      }
    }
  }
</script>
<style>
</style>
