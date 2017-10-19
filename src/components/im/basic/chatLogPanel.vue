<template>
  <div class="chatLogPanel">
    <div v-if="typeof cache.currentChatInfo.groupId === 'undefined'">还未初始化...</div>
    <div v-else style="height:100%;" class="layim-chat layui-show" :class="cache.msgAll[cache.currentChatInfo.groupId].groupType === 1 ? 'layim-chat-friend' : 'layim-chat-group'">
      <div class="layim-chatLog-main" id="layim-chatLog-main">
        <div v-for="item in cache.msgAll[cache.currentChatInfo.groupId].msgArray">
          <sysMsg v-if="item.type === 'sys'" :Message="item"></sysMsg>
          <privateMsg v-else :Message="item" v-show="item.status !== 3"></privateMsg>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import privateMsg from './message/privateMsg.vue'
  import sysMsg from './message/sysMsg.vue'
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
      privateMsg,
      sysMsg
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('loadImage', function (msg) {
        if (document.getElementById('layim-chatLog-main')) {
          document.getElementById('layim-chatLog-main').scrollTop = document.getElementById('layim-chatLog-main').scrollHeight
        }
      })
    },
    methods: {
    },
    updated: function () {
      if (document.getElementById('layim-chatLog-main')) {
        document.getElementById('layim-chatLog-main').scrollTop = document.getElementById('layim-chatLog-main').scrollHeight
      }
    }
  }
</script>
<style>
  .chatLogPanel {
    height: 100%;
  }
  .layim-chatLog-main {
    height: 100%;
    padding: 0px 15px 0px 15px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
