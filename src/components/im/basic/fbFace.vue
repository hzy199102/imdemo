<template>
  <span id='fbFace_face'class="layui-icon layim-tool-face" title="选择表情" @click="face">&#xe60c;</span>
</template>
<script>
  import facePanel from './facePanel.vue'
  import Vue from 'vue'
  export default {
    data () {
      return {
        facePanelVue: null
      }
    },
    components: {
    },
    methods: {
      face: function () {
        var _this = this
        _this.$root.layer.tips('<div id="facePanelContainer"></div>', _this.$root.$('#fbFace_face'), {
          tips: 1,
          time: 0,
          fix: true,
          area: ['394px', '146px'],
          skin: 'layui-box layui-layim-face',
          success: function (gccero, index) {
            _this.facePanelVue = new Vue({
              template: '<facePanel :facePanelIndex="facePanelIndex"/>',
              components: { facePanel },
              data: {
                facePanelIndex: index
              }
            })
            _this.facePanelVue.$mount('#facePanelContainer')
          }
        })
      }
    }
  }
</script>
<style>
</style>
