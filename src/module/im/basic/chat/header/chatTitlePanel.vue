<template>
  <div class="layui-unselect layim-chat-title">
    <div class="layim-chat-other">
      <img :src="cache.msgAll[cache.currentChatInfo.groupId].basicInfo.avatar">
        <span class="layim-chat-username" @click="groupMembers" @mousedown.stop="stopMousedown" id="groupMembers">
          {{ name() }}
          <em v-if="cache.msgAll[cache.currentChatInfo.groupId].groupType === 2" class="layim-chat-members">（{{ cache.msgAll[cache.currentChatInfo.groupId].basicInfo.members.length }}）</em>
          <i v-if="cache.msgAll[cache.currentChatInfo.groupId].groupType === 2 && !cache.msgAll[cache.currentChatInfo.groupId].basicInfo.openGroupMembers" class="layui-icon">&#xe61a;</i>
          <i v-if="cache.msgAll[cache.currentChatInfo.groupId].groupType === 2 && cache.msgAll[cache.currentChatInfo.groupId].basicInfo.openGroupMembers" class="layui-icon">&#xe619;</i>
        </span>
      <p v-if="cache.base.debug" class="layim-chat-status">{{ cache.msgAll[cache.currentChatInfo.groupId].basicInfo.groupId }}</p>
    </div>
  </div>
</template>
<style>
</style>
<script>
  import groupMembersPanel from './groupMembersPanel.vue'
  import Vue from 'vue'
  export default {
    props: ['cache'],
    data () {
      return {
        groupMembersPanelVue: null
      }
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('closeGroupMembers', function (msg) {
        _this.cache.msgAll[msg.groupId].basicInfo.openGroupMembers = false
      })
    },
    methods: {
      name: function () {
        var _this = this
        var name = ''
        if (_this.cache.msgAll[_this.cache.currentChatInfo.groupId].groupType === 1) {
          name = _this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.userName
        } else if (_this.cache.msgAll[_this.cache.currentChatInfo.groupId].groupType === 2) {
          name = _this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.groupName
        }
        return name
      },
      stopMousedown: function () {
        var _this = this
        _this.$root.eventHub.$emit('closeGroupMembersMenu', {})
      },
      groupMembers: function () {
        var _this = this
        if (_this.cache.msgAll[_this.cache.currentChatInfo.groupId].groupType !== 2) {
          return false
        }
        _this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openGroupMembers = !_this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openGroupMembers
        if (_this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openGroupMembers) {
          _this.$root.layer.tips('<div id="groupMembersPanelContainer"></div>', _this.$root.$('#groupMembers'), {
            tips: 3,
            time: 0,
            anim: 5,
            fixed: true,
            skin: 'layui-box layui-layim-members',
            success: function (gccero, index) {
              _this.groupMembersPanelVue = new Vue({
                template: '<groupMembersPanel :groupMembersPanelIndex="groupMembersPanelIndex" :groupId="groupId" :cache="cache"/>',
                components: { groupMembersPanel },
                data: {
                  groupMembersPanelIndex: index,
                  groupId: _this.cache.currentChatInfo.groupId,
                  cache: _this.cache
                }
              })
              _this.groupMembersPanelVue.$mount('#groupMembersPanelContainer')
              var ul = gccero.find('.layim-members-list')
              var hasFull = _this.$root.$('.layimChat').find('.layui-layer-max').hasClass('layui-layer-maxmin')
              var listNone = _this.$root.$('.layimChat').find('.layim-chat-list').css('display') === 'none'
              if (hasFull) {
                ul.css({
                  width: _this.$root.$(window).width() - 22 - (listNone || 200)
                })
              }
              gccero.on('contextmenu', function (event) {
                event.cancelBubble = true
                event.returnValue = false
                return false
              })
            }
          })
        } else {
          _this.$root.eventHub.$emit('closeGroupMembers2', {
            groupId: _this.cache.currentChatInfo.groupId
          })
        }
      }
    },
    components: {
    }
  }
</script>
