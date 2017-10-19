<template>
  <div class="chatPanel">
    <div class="layim-chat-box">
      <div class="layim-chat layui-show" :class="cache.msgAll[cache.currentChatInfo.groupId].groupType === 1 ? 'layim-chat-friend' : 'layim-chat-group'">
        <chatTitlePanel :cache="cache"></chatTitlePanel>
        <div class="layim-chat-main" id="layim-chat-main">
          <!--<ul></ul>-->
          <div v-for="item in cache.msgAll[cache.currentChatInfo.groupId].msgArray">
            <sysMsg v-if="item.type === 'sys'" :Message="item"></sysMsg>
            <privateMsg v-else :Message="item" v-show="item.status !== 3"></privateMsg>
          </div>
        </div>
        <chatFooterPanel :cache="cache"></chatFooterPanel>
      </div>
    </div>
  </div>
</template>
<script>
  import chatTitlePanel from './chatTitlePanel.vue'
  import chatFooterPanel from './chatFooterPanel.vue'
  import privateMsg from './message/privateMsg.vue'
  import sysMsg from './message/sysMsg.vue'
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
      chatTitlePanel,
      chatFooterPanel,
      privateMsg,
      sysMsg
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('loadImage', function (msg) {
        document.getElementById('layim-chat-main').scrollTop = document.getElementById('layim-chat-main').scrollHeight
      })
    },
    methods: {
    },
    updated: function () {
      document.getElementById('layim-chat-main').scrollTop = document.getElementById('layim-chat-main').scrollHeight
    }
  }
</script>
<style>
  .chatPanel {
  }
</style>
