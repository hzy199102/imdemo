<template>
  <li class="friendGroupPanel">
    <h5 @click="spread"><i class="layui-icon" v-html="spreadIcon()"></i><span>{{ frinedGoupItem.groupName }}</span><em>(<cite class="layim-count"> {{ frinedGoupItem.list.length }}</cite>)</em></h5>
    <ul v-if="type === 1" class="layui-layim-list" :class="spreadStatus ? 'layui-show' : ''">
      <friendFriendPanel v-for="(friendFriendItem,key) in frinedGoupItem.list" :friendFriendItem="friendFriendItem" :cache="cache" :type="type"></friendFriendPanel>
      <li v-if="frinedGoupItem.list.length === 0" class="layim-null">该分组下暂无好友</li>
    </ul>
    <ul v-if="type === 2" class="layui-layim-list" :class="spreadStatus ? 'layui-show' : ''">
      <inviteFriendPanel v-for="(inviteFriendItem,key) in frinedGoupItem.list" :inviteFriendItem="inviteFriendItem" :cache="cache" :type="type"></inviteFriendPanel>
      <li v-if="frinedGoupItem.list.length === 0" class="layim-null">该分组下暂无好友</li>
    </ul>
  </li>
</template>
<script>
  import friendFriendPanel from './friendFriendPanel.vue'
  import inviteFriendPanel from './inviteFriendPanel.vue'
  export default {
    props: ['frinedGoupItem', 'cache', 'type'],
    data () {
      return {
        spreadStatus: false
      }
    },
    components: {
      friendFriendPanel,
      inviteFriendPanel
    },
    created: function () {
      var _this = this
      _this.spreadStatus = _this.cache.local['spread' + _this.frinedGoupItem.id] || false
    },
    methods: {
      spreadIcon: function () {
        var _this = this
        return _this.spreadStatus ? '&#xe61a;' : '&#xe602;'
      },
      spread: function () {
        var _this = this
        _this.spreadStatus = !_this.spreadStatus
        _this.cache.local['spread' + _this.frinedGoupItem.id] = _this.spreadStatus
      }
    }
  }
</script>
<style>
  .friendGroupPanel {
  }
</style>
