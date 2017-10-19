<template>
  <div class="findPanel">
    <ul class="layui-unselect layui-layim-tab" style="width:260px;margin-top: 0px;">
      <li class="layui-icon" :class="tabStatus === 1 ? 'layim-this' : ''" title="找人" @click="tabChange(1)" style="font-size: 14px;">找人</li>
      <li class="layui-icon" :class="tabStatus === 2 ? 'layim-this' : ''" title="找群" @click="tabChange(2)" style="font-size: 14px;">找群</li>
    </ul>
    <div :class="tabStatus === 1 ? 'layui-show' : ''" style="display: none;">
      <findFriendPanel :cache="cache"></findFriendPanel>
    </div>
    <div :class="tabStatus === 2 ? 'layui-show' : ''" style="display: none;">
      <findGroupPanel :cache="cache"></findGroupPanel>
    </div>
  </div>
</template>
<script>
  import findFriendPanel from './findFriendPanel.vue'
  import findGroupPanel from './findGroupPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        tabStatus: 1
      }
    },
    components: {
      findFriendPanel,
      findGroupPanel
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('closeFind', function (msg) {
        _this.$destroy()
      })
    },
    methods: {
      tabChange: function (num) {
        var _this = this
        _this.tabStatus = num
      }
    },
    destroyed: function () {
      var _this = this
      console.log(_this)
    }
  }
</script>
<style>
  .findPanel {
  }
</style>
