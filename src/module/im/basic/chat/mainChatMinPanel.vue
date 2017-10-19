<template>
  <div class="mainChatMinPanel">
    <img id="layui-layim-min" :src="avatar()"><span>{{ name() }}</span>
  </div>
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
      var _this = this
      _this.eventHub.$on('closeChatMin', function (msg) {
        _this.$destroy()
      })
    },
    methods: {
      avatar: function () {
        var _this = this
        var obj = null
        if (_this.cache.newChatList.length > 0) {
          obj = _this.cache.newChatList[0]
        } else {
          obj = _this.cache.currentChatInfo
        }
        return _this.cache.msgAll[obj.groupId].basicInfo.avatar
      },
      name: function () {
        var _this = this
        var name = ''
        var obj = null
        if (_this.cache.newChatList.length > 0) {
          obj = _this.cache.newChatList[0]
        } else {
          obj = _this.cache.currentChatInfo
        }
        name = _this.cache.msgAll[obj.groupId].basicInfo.userName
        return name
      }
    }
  }
</script>
<style>
  .mainChatMinPanel {
  }
</style>
