<template>
  <li class="sessionPanel">
    <ul class="layui-layim-list layui-show">
      <sessionFriendPanel v-for="(sessionFriendItem,key) in cache.session" :sessionFriendItem="sessionFriendItem" :cache="cache"></sessionFriendPanel>
      <li v-if="cache.session.length === 0" class="layim-null" style="height:320px; line-height: 320px;" >暂无会话</li>
    </ul>
  </li>
</template>
<script>
  import sessionFriendPanel from './sessionFriendPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
      sessionFriendPanel
    },
    created: function () {
    },
    methods: {
    }
  }
</script>
<style>
  .sessionPanel {
  }
</style>
