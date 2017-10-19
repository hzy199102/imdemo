<template>
  <li @click="chat" class="sessionFriendPanel">
    <img :src="sessionFriendItem.avatar">
    <span>{{ sessionFriendItem.groupName }}</span>
    <p>{{ sessionFriendItem.lastMsg || '' }}</p>
    <span class="layim-msg-status" :class="cache.msgAll[sessionFriendItem.groupId].unread > 0 ? 'layui-show' : ''" >{{ unread() }}</span>
  </li>
</template>
<script>
  export default {
    props: ['sessionFriendItem', 'cache'],
    data () {
      return {
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
          groupId: _this.sessionFriendItem.groupId
        })
      },
      unread: function () {
        var _this = this
        return _this.cache.msgAll[_this.sessionFriendItem.groupId].unread > 999 ? '999+' : _this.cache.msgAll[_this.sessionFriendItem.groupId].unread
      }
    }
  }
</script>
<style>
  .sessionFriendPanel {
  }
</style>
