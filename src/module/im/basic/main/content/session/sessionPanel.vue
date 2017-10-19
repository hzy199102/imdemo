<template>
  <li class="sessionPanel">
    <ul class="layui-layim-list layui-show">
      <li v-if="cache.session.length === 0" class="layim-null" style="height:320px; line-height: 320px;" >暂无会话</li>
      <li v-for="(sessionFriendItem,key) in cache.session" @click="chat(sessionFriendItem)" class="sessionFriendPanel">
        <img :src="sessionFriendItem.avatar">
        <span>{{ sessionFriendItem.groupName }}</span>
        <p>{{ sessionFriendItem.lastMsg || '' }}</p>
        <span class="layim-msg-status" :class="cache.msgAll[sessionFriendItem.groupId].unread > 0 ? 'layui-show' : ''" >{{ unread(sessionFriendItem) }}</span>
      </li>
    </ul>
  </li>
</template>
<script>
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      chat: function (sessionFriendItem) {
        var _this = this
        _this.$root.eventHub.$emit('chat', {
          groupId: sessionFriendItem.groupId
        })
      },
      unread: function (sessionFriendItem) {
        var _this = this
        return _this.cache.msgAll[sessionFriendItem.groupId].unread > 999 ? '999+' : _this.cache.msgAll[sessionFriendItem.groupId].unread
      }
    }
  }
</script>
<style>
  .sessionPanel {
  }
</style>
