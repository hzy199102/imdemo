<template>
  <div :class="cache.msgAll[chatListItem.groupId].unread > 0 ? 'layim-new-message' : ''" >
    <li :class="chatListItem.groupId === cache.currentChatInfo.groupId ? 'layim-this' : ''" @click="changeChat">
      <img :src="cache.msgAll[chatListItem.groupId].basicInfo.avatar">
      <span>{{ cache.msgAll[chatListItem.groupId].basicInfo.userName }}</span>
      <i class="layui-icon" @click.stop="closeChat">&#x1007;</i>
    </li>
  </div>
</template>
<script>
  export default {
    props: ['chatListItem', 'cache'],
    data () {
      return {
        layim_new_message: false,
        layim_this: false
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      changeChat: function () {
        var _this = this
        _this.$root.eventHub.$emit('changeChat', _this.chatListItem)
      },
      closeChat: function () {
        var _this = this
        _this.$root.eventHub.$emit('closeChat', _this.chatListItem)
      }
    }
  }
</script>
<style>
  .layim-new-message li {
    background-color: red !important;
  }
</style>
