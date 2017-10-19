<template>
  <div class="plain">
    <pre v-html="content()"></pre>
    <img class="ico_loading" :class="Message.status === 1 ? '' : 'hide'" src="../../../../assets/img/ico_loading.gif" alt="">
    <i class="ico_fail web_icon_message_fail" :class="Message.status === 2 ? '' : 'hide'" title="重新发送" @click="clickResendMsg"></i>
  </div>
</template>
<script>
  export default {
    props: ['Message'],
    data () {
      return {
        faces: [
          {
            key: 'grin',
            value: require('../../../../assets/img/face/Face001.png')
          }, {
            key: 'joy',
            value: require('../../../../assets/img/face/Face002.png')
          }, {
            key: 'smiley',
            value: require('../../../../assets/img/face/Face003.png')
          }, {
            key: 'smile',
            value: require('../../../../assets/img/face/Face004.png')
          }, {
            key: 'wink',
            value: require('../../../../assets/img/face/Face005.png')
          }, {
            key: 'blush',
            value: require('../../../../assets/img/face/Face006.png')
          }, {
            key: 'satisfied',
            value: require('../../../../assets/img/face/Face007.png')
          }, {
            key: 'heart_eyes',
            value: require('../../../../assets/img/face/Face008.png')
          }, {
            key: 'kissing_heart',
            value: require('../../../../assets/img/face/Face009.png')
          }, {
            key: 'smirk',
            value: require('../../../../assets/img/face/Face010.png')
          }, {
            key: 'kissing_closed_eyes',
            value: require('../../../../assets/img/face/Face011.png')
          }, {
            key: 'wink2',
            value: require('../../../../assets/img/face/Face012.png')
          }, {
            key: 'stuck_out_tongue_closed_eyes',
            value: require('../../../../assets/img/face/Face013.png')
          }, {
            key: 'unamused',
            value: require('../../../../assets/img/face/Face014.png')
          }, {
            key: 'flushed',
            value: require('../../../../assets/img/face/Face015.png')
          }, {
            key: 'disappointed',
            value: require('../../../../assets/img/face/Face016.png')
          }, {
            key: 'angry',
            value: require('../../../../assets/img/face/Face017.png')
          }, {
            key: 'rage',
            value: require('../../../../assets/img/face/Face018.png')
          }, {
            key: 'pensive',
            value: require('../../../../assets/img/face/Face019.png')
          }, {
            key: 'persevere',
            value: require('../../../../assets/img/face/Face020.png')
          }, {
            key: 'confounded',
            value: require('../../../../assets/img/face/Face021.png')
          }, {
            key: 'scream',
            value: require('../../../../assets/img/face/Face022.png')
          }, {
            key: 'fearful',
            value: require('../../../../assets/img/face/Face023.png')
          }, {
            key: 'cold_sweat',
            value: require('../../../../assets/img/face/Face024.png')
          }, {
            key: 'cry',
            value: require('../../../../assets/img/face/Face025.png')
          }, {
            key: 'relieved',
            value: require('../../../../assets/img/face/Face026.png')
          }, {
            key: 'sleepy',
            value: require('../../../../assets/img/face/Face027.png')
          }, {
            key: 'sweat',
            value: require('../../../../assets/img/face/Face028.png')
          }, {
            key: 'sob',
            value: require('../../../../assets/img/face/Face029.png')
          }, {
            key: 'astonished',
            value: require('../../../../assets/img/face/Face030.png')
          }, {
            key: 'mask',
            value: require('../../../../assets/img/face/Face031.png')
          }, {
            key: 'pray',
            value: require('../../../../assets/img/face/Face032.png')
          }, {
            key: 'lips',
            value: require('../../../../assets/img/face/Face033.png')
          }, {
            key: 'lipstick',
            value: require('../../../../assets/img/face/Face034.png')
          }, {
            key: 'high_heel',
            value: require('../../../../assets/img/face/Face035.png')
          }, {
            key: 'closed_umbrella',
            value: require('../../../../assets/img/face/Face036.png')
          }, {
            key: 'rose',
            value: require('../../../../assets/img/face/Face037.png')
          }, {
            key: 'moon',
            value: require('../../../../assets/img/face/Face038.png')
          }, {
            key: 'fire',
            value: require('../../../../assets/img/face/Face039.png')
          }, {
            key: 'apple',
            value: require('../../../../assets/img/face/Face040.png')
          }, {
            key: 'watermelon',
            value: require('../../../../assets/img/face/Face041.png')
          }, {
            key: 'strawberry',
            value: require('../../../../assets/img/face/Face042.png')
          }, {
            key: 'tomato',
            value: require('../../../../assets/img/face/Face043.png')
          }, {
            key: 'beer',
            value: require('../../../../assets/img/face/Face044.png')
          }, {
            key: 'beers',
            value: require('../../../../assets/img/face/Face045.png')
          }, {
            key: 'smoking',
            value: require('../../../../assets/img/face/Face046.png')
          }, {
            key: 'pill',
            value: require('../../../../assets/img/face/Face047.png')
          }, {
            key: 'syringe',
            value: require('../../../../assets/img/face/Face048.png')
          }
        ]
      }
    },
    methods: {
      clickResendMsg: function () {
        var _this = this
        _this.Message.status = 3
        var msg = _this.$root.$.extend(true, {}, _this.Message)
        msg.status = 1
        msg.sendTime = new Date().getTime()
        _this.$root.eventHub.$emit('mineMessage', msg)
      },
      content: function () {
        var _this = this
        var content = _this.Message.content
        var urlRegex = ["((https?|news|gopher|telnet|ftp|file)://|www.)"
          ,"[A-Za-z0-9.:-]+(/[A-Za-z0-9\?&=#;"
          ,"+!'()*-._~%()]*)*"].join('')
        urlRegex = new RegExp(urlRegex,"g")
        content = (content||'').replace(urlRegex, function(str){
            var href = str;
            if (str.indexOf('http') === -1) {
              href = 'http://' + str;
            }
            return '<a class="layim-chat-href" href="' + href + '" target="_blank">' + (str) + '</a>'
          })
          .replace(/\[:([^\s\[\]]+?)\:]/g, function(face){
            var alt = face.replace(/^\[:/g, '').replace(/:\]/g, '')
            var position = -1
            for (var i = 0; i < _this.faces.length; i++) {
              if (_this.faces[i].key === alt) {
                position = i
                break
              }
            }
            if (position >= 0) {
              return '<img class="face" replace="' + face + '" alt="' + face + '" title="' + face + '" src="' + _this.faces[position].value + '">'
            } else {
              return face
            }
          })
        return content
      }
    }
  }
</script>
<style>
  .plain {
    padding: 9px 13px;
  }
  pre {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .bubble_content .plain .ico_loading {
    position: absolute;
    right: 100%;
    top: 50%;
    margin-top: -7px;
    margin-right: 13px;
  }
  .bubble_content .plain .ico_fail {
    position: absolute;
    right: 100%;
    top: 50%;
    margin-top: -11px;
    margin-right: 9px;
    cursor: pointer;
  }
  .web_icon_message_fail {
    background: url(../../../../assets/img/sprite308b49.png) 0 -1270px;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    display: inline-block;
  }
  .hide {
    display: none !important;
  }
  .layim-chat-href {
    color: -webkit-link !important;
    text-decoration: underline !important;
    cursor: auto !important;
  }
</style>
