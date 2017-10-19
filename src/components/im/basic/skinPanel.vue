<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="skinPanel">
    <ul class="layui-layim-skin">
      <li v-for="(skinItem,key) in cache.skin">
        <img @click="setSkin(key)" v-bind:src="skinItem">
      </li>
      <li @click="setSkin()"><cite>简约</cite></li>'
    </ul>
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
    },
    methods: {
      setSkin: function (skin) {
        var _this = this
        if (typeof skin === 'undefined') {
          delete _this.cache.local.skin
        } else {
          _this.cache.local.skin = skin
        }
        _this.$root.eventHub.$emit('skinChange', {})
      }
    }
  }
</script>
<style>
  .skinPanel {
  }
</style>
