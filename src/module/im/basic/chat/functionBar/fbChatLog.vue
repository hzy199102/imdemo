<template>
  <span class="layim-tool-log" @click="chatLog"><i class="layui-icon">&#xe60e;</i>聊天记录</span>
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
      chatLog: function () {
        var _this = this
        _this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openChatLog = !_this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openChatLog
        if (_this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openChatLog) {
          _this.$root.$('.layimChatLog').show()
        } else {
          _this.$root.$('.layimChatLog').hide()
        }
      }
    }
  }
</script>
<style>
</style>
