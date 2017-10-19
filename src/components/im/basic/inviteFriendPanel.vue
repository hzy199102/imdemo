<template>
  <li @click="choose" class="inviteFriendPanel" style="height: 20px;">
    <img :src="cache.msgAll[inviteFriendItem.groupId].basicInfo.avatar" style="width: 20px; height: 20px;">
    <span style="margin-left: -15px;">{{ cache.msgAll[inviteFriendItem.groupId].basicInfo.userName }}</span>
  </li>
</template>
<script>
  export default {
    props: ['inviteFriendItem', 'cache', 'type'],
    data () {
      return {
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      choose: function () {
        var _this = this
        if (_this.type === 2) {
          console.log('选择邀请群员')
          if ((_this.cache.inviteFriend.length + 1) === _this.cache.capacity) {
            _this.$root.layer.msg('邀请人数超过上限')
            return false
          }
          var inviteFriendPosition2 = -1
          for (var i = 0; i < _this.cache.inviteFriend.length; i++) {
            if (_this.cache.inviteFriend[i].groupId === _this.inviteFriendItem.groupId) {
              inviteFriendPosition2 = i
              break
            }
          }
          if (inviteFriendPosition2 === -1) {
            _this.cache.inviteFriend.push(_this.inviteFriendItem)
          }
        } else if (_this.type === 4) {
          console.log('去除邀请群员')
          var inviteFriendPosition4 = -1
          for (var j = 0; j < _this.cache.inviteFriend.length; j++) {
            if (_this.cache.inviteFriend[j].groupId === _this.inviteFriendItem.groupId) {
              inviteFriendPosition4 = j
              break
            }
          }
          if (inviteFriendPosition4 > -1) {
            _this.cache.inviteFriend.splice(inviteFriendPosition4, 1)
          }
        }
      }
    }
  }
</script>
<style>
  .inviteFriendPanel {
  }
</style>
