<template xmlns:v-bind="http:/www.w3.org/1999/xhtml">
  <ul class="layui-clear layim-face-list" @mousedown.stop="stopMousedown">
    <li v-for="(faceItem,i) in faces" :title="faceItem.key"><img class="face" v-bind:src="faceItem.value" @click="chooseFace(faceItem.key)"></li>
  </ul>
</template>
<script>
  export default {
    props: ['facePanelIndex'],
    data () {
      return {
        faces: [
          {
            key: 'grin',
            value: require('../../../assets/img/face/Face001.png')
          }, {
            key: 'joy',
            value: require('../../../assets/img/face/Face002.png')
          }, {
            key: 'smiley',
            value: require('../../../assets/img/face/Face003.png')
          }, {
            key: 'smile',
            value: require('../../../assets/img/face/Face004.png')
          }, {
            key: 'wink',
            value: require('../../../assets/img/face/Face005.png')
          }, {
            key: 'blush',
            value: require('../../../assets/img/face/Face006.png')
          }, {
            key: 'satisfied',
            value: require('../../../assets/img/face/Face007.png')
          }, {
            key: 'heart_eyes',
            value: require('../../../assets/img/face/Face008.png')
          }, {
            key: 'kissing_heart',
            value: require('../../../assets/img/face/Face009.png')
          }, {
            key: 'smirk',
            value: require('../../../assets/img/face/Face010.png')
          }, {
            key: 'kissing_closed_eyes',
            value: require('../../../assets/img/face/Face011.png')
          }, {
            key: 'wink2',
            value: require('../../../assets/img/face/Face012.png')
          }, {
            key: 'stuck_out_tongue_closed_eyes',
            value: require('../../../assets/img/face/Face013.png')
          }, {
            key: 'unamused',
            value: require('../../../assets/img/face/Face014.png')
          }, {
            key: 'flushed',
            value: require('../../../assets/img/face/Face015.png')
          }, {
            key: 'disappointed',
            value: require('../../../assets/img/face/Face016.png')
          }, {
            key: 'angry',
            value: require('../../../assets/img/face/Face017.png')
          }, {
            key: 'rage',
            value: require('../../../assets/img/face/Face018.png')
          }, {
            key: 'pensive',
            value: require('../../../assets/img/face/Face019.png')
          }, {
            key: 'persevere',
            value: require('../../../assets/img/face/Face020.png')
          }, {
            key: 'confounded',
            value: require('../../../assets/img/face/Face021.png')
          }, {
            key: 'scream',
            value: require('../../../assets/img/face/Face022.png')
          }, {
            key: 'fearful',
            value: require('../../../assets/img/face/Face023.png')
          }, {
            key: 'cold_sweat',
            value: require('../../../assets/img/face/Face024.png')
          }, {
            key: 'cry',
            value: require('../../../assets/img/face/Face025.png')
          }, {
            key: 'relieved',
            value: require('../../../assets/img/face/Face026.png')
          }, {
            key: 'sleepy',
            value: require('../../../assets/img/face/Face027.png')
          }, {
            key: 'sweat',
            value: require('../../../assets/img/face/Face028.png')
          }, {
            key: 'sob',
            value: require('../../../assets/img/face/Face029.png')
          }, {
            key: 'astonished',
            value: require('../../../assets/img/face/Face030.png')
          }, {
            key: 'mask',
            value: require('../../../assets/img/face/Face031.png')
          }, {
            key: 'pray',
            value: require('../../../assets/img/face/Face032.png')
          }, {
            key: 'lips',
            value: require('../../../assets/img/face/Face033.png')
          }, {
            key: 'lipstick',
            value: require('../../../assets/img/face/Face034.png')
          }, {
            key: 'high_heel',
            value: require('../../../assets/img/face/Face035.png')
          }, {
            key: 'closed_umbrella',
            value: require('../../../assets/img/face/Face036.png')
          }, {
            key: 'rose',
            value: require('../../../assets/img/face/Face037.png')
          }, {
            key: 'moon',
            value: require('../../../assets/img/face/Face038.png')
          }, {
            key: 'fire',
            value: require('../../../assets/img/face/Face039.png')
          }, {
            key: 'apple',
            value: require('../../../assets/img/face/Face040.png')
          }, {
            key: 'watermelon',
            value: require('../../../assets/img/face/Face041.png')
          }, {
            key: 'strawberry',
            value: require('../../../assets/img/face/Face042.png')
          }, {
            key: 'tomato',
            value: require('../../../assets/img/face/Face043.png')
          }, {
            key: 'beer',
            value: require('../../../assets/img/face/Face044.png')
          }, {
            key: 'beers',
            value: require('../../../assets/img/face/Face045.png')
          }, {
            key: 'smoking',
            value: require('../../../assets/img/face/Face046.png')
          }, {
            key: 'pill',
            value: require('../../../assets/img/face/Face047.png')
          }, {
            key: 'syringe',
            value: require('../../../assets/img/face/Face048.png')
          }
        ]
      }
    },
    created: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide).on('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide).on('resize', _this.hide)
    },
    destroyed: function () {
      var _this = this
      _this.$root.$(document).off('mousedown', _this.hide)
      _this.$root.$(window).off('resize', _this.hide)
      _this.$root.layer.close(_this.facePanelIndex)
    },
    methods: {
      hide: function () {
        var _this = this
        _this.$destroy()
      },
      stopMousedown: function () {
      },
      chooseFace: function (key) {
        var _this = this
        _this.$root.eventHub.$emit('face', {
          face: '[:' + key + ':]'
        })
      }
    }
  }
</script>
<style>
  .face {
    width: 22px;
    height: 22px;
  }
</style>
