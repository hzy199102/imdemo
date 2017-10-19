<template>
  <div class="mainChatPanel">
    <ul class="layui-unselect layim-chat-list">
      <chatListPanel v-for="(chatListItem,key) in cache.chatList" :chatListItem="chatListItem" :cache="cache"></chatListPanel>
    </ul>
    <chatPanel :cache="cache"></chatPanel>
  </div>
</template>
<script>
  import chatListPanel from './chatListPanel.vue'
  import chatPanel from './chatPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
      chatListPanel,
      chatPanel
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('closeChatMax', function (msg) {
        _this.$destroy()
      })
    },
    methods: {
    }
  }
</script>
<style>
  .mainChatPanel {
  }
</style>
