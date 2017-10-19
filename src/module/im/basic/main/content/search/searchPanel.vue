<template>
  <li class="sessionPanel">
    <ul class="layui-layim-list layui-show layim-list-history">
      <div v-for="(searchFriendItem,key) in cache.search">
        <friendFriendPanel v-if="cache.msgAll[searchFriendItem.groupId].groupType === 1" :friendFriendItem="searchFriendItem" :cache="cache"></friendFriendPanel>
        <groupFriendPanel v-if="cache.msgAll[searchFriendItem.groupId].groupType === 2" :groupFriendItem="searchFriendItem" :cache="cache"></groupFriendPanel>
      </div>
      <li v-if="cache.search.length === 0" class="layim-null">无搜索结果</li>
    </ul>
  </li>
</template>
<script>
  import friendFriendPanel from '../friend/friendFriendPanel.vue'
  import groupFriendPanel from '../group/groupFriendPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
      }
    },
    components: {
      friendFriendPanel,
      groupFriendPanel
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
