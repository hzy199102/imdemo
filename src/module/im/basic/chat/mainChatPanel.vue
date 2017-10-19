<template>
  <div class="mainChatPanel">
    <ul class="layui-unselect layim-chat-list">
      <div v-for="(chatListItem,key) in cache.chatList" :class="cache.msgAll[chatListItem.groupId].unread > 0 ? 'layim-new-message' : ''" >
        <li :class="chatListItem.groupId === cache.currentChatInfo.groupId ? 'layim-this' : ''" @click="changeChat(chatListItem)">
          <img :src="cache.msgAll[chatListItem.groupId].basicInfo.avatar">
          <span>{{ cache.msgAll[chatListItem.groupId].basicInfo.userName }}</span>
          <i class="layui-icon" @click.stop="closeChat(chatListItem)">&#x1007;</i>
        </li>
      </div>
    </ul>
    <div class="chatPanel">
      <div class="layim-chat-box">
        <div class="layim-chat layui-show" :class="cache.msgAll[cache.currentChatInfo.groupId].groupType === 1 ? 'layim-chat-friend' : 'layim-chat-group'">
          <chatTitlePanel :cache="cache"></chatTitlePanel>
          <div class="layim-chat-main" id="layim-chat-main">
            <div v-for="item in cache.msgAll[cache.currentChatInfo.groupId].msgArray">
              <sysMsg v-if="item.type === 'sys'" :Message="item"></sysMsg>
              <privateMsg v-else :Message="item" v-show="item.status !== 3"></privateMsg>
            </div>
          </div>
          <chatFooterPanel :cache="cache"></chatFooterPanel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import chatTitlePanel from './header/chatTitlePanel.vue'
  import chatFooterPanel from './footer/chatFooterPanel.vue'
  import privateMsg from '../message/privateMsg.vue'
  import sysMsg from '../message/sysMsg.vue'
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
      _this.eventHub.$on('closeChatMax', function (msg) {
        _this.$destroy()
      })
      _this.eventHub.$on('loadImage', function (msg) {
        document.getElementById('layim-chat-main').scrollTop = document.getElementById('layim-chat-main').scrollHeight
      })
    },
    methods: {
      changeChat: function (chatListItem) {
        var _this = this
        _this.$root.eventHub.$emit('changeChat', chatListItem)
      },
      closeChat: function (chatListItem) {
        var _this = this
        _this.$root.eventHub.$emit('closeChat', chatListItem)
      }
    },
    updated: function () {
      document.getElementById('layim-chat-main').scrollTop = document.getElementById('layim-chat-main').scrollHeight
    }
  }
</script>
<style>
  .mainChatPanel {
  }
  .layim-new-message li {
    background-color: red !important;
  }
  .chatPanel {
  }
</style>
