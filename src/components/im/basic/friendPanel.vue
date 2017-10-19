<template>
  <div class="friendPanel">
    <friendGroupPanel v-for="(frinedGoupItem,key) in cache.friend" :frinedGoupItem="frinedGoupItem" :cache="cache" :type="type"></friendGroupPanel>
    <li v-if="Object.getOwnPropertyNames(cache.friend).length === 1">
      <ul class="layui-layim-list layui-show">
        <li class="layim-null" style="height:320px; line-height: 320px;" >暂无联系人</li>
      </ul>
    </li>
  </div>
</template>
<script>
  import friendGroupPanel from './friendGroupPanel.vue'
  export default {
    props: ['cache', 'type'],
    data () {
      return {
      }
    },
    components: {
      friendGroupPanel
    },
    created: function () {
    },
    methods: {
    }
  }
</script>
<style>
  .friendPanel {
  }
</style>
