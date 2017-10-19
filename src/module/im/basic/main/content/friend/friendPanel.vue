<template>
  <div class="friendPanel">
    <li v-if="Object.getOwnPropertyNames(cache.friend).length === 1">
      <ul class="layui-layim-list layui-show">
        <li class="layim-null" style="height:320px; line-height: 320px;" >暂无联系人</li>
      </ul>
    </li>
    <li class="friendGroupPanel" v-for="(frinedGoupItem,key) in cache.friend">
      <h5 @click="spread(frinedGoupItem)"><i class="layui-icon" v-html="spreadIcon(frinedGoupItem)"></i><span>{{ frinedGoupItem.groupName }}</span><em>(<cite class="layim-count"> {{ frinedGoupItem.list.length }}</cite>)</em></h5>
      <ul v-if="type === 1" class="layui-layim-list" :class="cache.local['spread' + frinedGoupItem.id] ? 'layui-show' : ''">
        <friendFriendPanel v-for="(friendFriendItem,key) in frinedGoupItem.list" :friendFriendItem="friendFriendItem" :cache="cache" :type="type"></friendFriendPanel>
        <li v-if="frinedGoupItem.list.length === 0" class="layim-null">该分组下暂无好友</li>
      </ul>
      <ul v-if="type === 2" class="layui-layim-list" :class="cache.local['spread' + frinedGoupItem.id] ? 'layui-show' : ''">
        <inviteFriendPanel v-for="(inviteFriendItem,key) in frinedGoupItem.list" :inviteFriendItem="inviteFriendItem" :cache="cache" :type="type"></inviteFriendPanel>
        <li v-if="frinedGoupItem.list.length === 0" class="layim-null">该分组下暂无好友</li>
      </ul>
    </li>
  </div>
</template>
<script>
  import friendFriendPanel from './friendFriendPanel.vue'
  import inviteFriendPanel from './inviteFriendPanel.vue'
  export default {
    props: ['cache', 'type'],
    data () {
      return {
      }
    },
    components: {
      friendFriendPanel,
      inviteFriendPanel
    },
    created: function () {
    },
    methods: {
      spreadIcon: function (frinedGoupItem) {
        var _this = this
        return _this.cache.local['spread' + frinedGoupItem.id] ? '&#xe61a;' : '&#xe602;'
      },
      spread: function (frinedGoupItem) {
        var _this = this
        _this.$set(_this.cache.local, 'spread' + frinedGoupItem.id, !_this.cache.local['spread' + frinedGoupItem.id])
//        _this.cache.local['spread' + frinedGoupItem.id] = !_this.cache.local['spread' + frinedGoupItem.id] //这个参数不是提前注册，不会被监听
      }
    }
  }
</script>
<style>
  .friendPanel {
  }
  .friendGroupPanel {
  }
</style>
