<template>
  <div class="layim-chat-footer">
    <div class="layui-unselect layim-chat-tool">
      <fbFace></fbFace>
      <fbImage :cache="cache"></fbImage>
      <fbFile :cache="cache"></fbFile>
      <span class="layui-icon layim-tool-audio" title="发送网络音频" layim-event="media" data-type="audio">&#xe6fc;</span>
      <span class="layui-icon layim-tool-video" title="发送网络视频" layim-event="media" data-type="video">&#xe6ed;</span>
      <fbChatLog :cache="cache"></fbChatLog>
    </div>
    <div class="layim-chat-textarea"><textarea id="textarea" @keyup.13="onEnter" @keydown.13="onBeforeEnter" v-model="textarea"></textarea></div>
    <div class="layim-chat-bottom">
      <div class="layim-chat-send">
        <span class="layim-send-close" @click="closeThisChat">关闭</span>
        <span class="layim-send-btn" @click="send">发送</span>
        <span class="layim-send-set" @click="setSend('show')"><em class="layui-edge"></em></span>
        <ul class="layui-anim layim-menu-box" :class="setSendStatus ? 'layui-show' : ''">
          <li :class="cache.local.sendHotKey !== 'Ctrl+Enter' ? 'layim-this' : ''"  @click="setSend('Enter')"><i class="layui-icon">&#xe618;</i>按Enter键发送消息</li>
          <li :class="cache.local.sendHotKey === 'Ctrl+Enter' ? 'layim-this' : ''"  @click="setSend('Ctrl+Enter')"><i class="layui-icon">&#xe618;</i>按Ctrl+Enter键发送消息</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
  import fbFace from '../functionBar/fbFace.vue'
  import fbImage from '../functionBar/fbImage.vue'
  import fbChatLog from '../functionBar/fbChatLog.vue'
  import fbFile from '../functionBar/fbFile.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        textarea: '',
        setSendStatus: false
      }
    },
    components: {
      fbFace,
      fbChatLog,
      fbImage,
      fbFile
    },
    created: function () {
      var _this = this
      _this.eventHub.$on('face', function (msg) {
        _this.focusInsert(_this.$root.$('#textarea')[0], msg.face)
      })
      _this.$watch('cache.currentChatInfo.groupId', function (newVal, oldVal) {
        _this.cache.tempContent[oldVal] = _this.textarea
        _this.textarea = _this.cache.tempContent[newVal] || ''
      })
      _this.$watch('textarea', function (newVal, oldVal) {
//        _this.cache.tempContent[oldVal] = _this.textarea
//        _this.textarea = _this.cache.tempContent[newVal] || ''
      })
    },
    methods: {
      focusInsert: function (obj, str) {
        var _this = this
        var result
        var val = _this.textarea
        obj.focus()
        if (document.selection) {
          result = document.selection.createRange()
          document.selection.empty()
          result.text = str
        } else {
          result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)]
          obj.focus()
          _this.textarea = result.join('')
        }
      },
      onBeforeEnter: function (e) {
        e.preventDefault()
      },
      onEnter: function (e) {
        var _this = this
        if (!_this.cache.local.sendHotKey || _this.cache.local.sendHotKey === 'Enter') {
          if (e.ctrlKey) {
            _this.textarea = _this.textarea + '\n'
          } else {
            _this.send()
          }
        } else {
          if (e.ctrlKey) {
            _this.send()
          }
        }
      },
      send: function () {
        var _this = this
        if (_this.textarea.trim().length !== 0) {
          _this.$root.eventHub.$emit('mineMessage', {
            mine: true,
            sendTime: new Date().getTime(),
            name: _this.cache.mine.userName,
            content: _this.textarea,
            type: 'text',
            status: 1,
            avatar: _this.cache.mine.avatar,
            groupId: _this.cache.currentChatInfo.groupId
          })
        }
        _this.textarea = ''
      },
      setSend: function (type) {
        var _this = this
        if (type === 'show') {
          _this.setSendStatus = true
        } else if (type === 'Enter') {
          _this.cache.local.sendHotKey = 'Enter'
          _this.setSendStatus = false
        } else if (type === 'Ctrl+Enter') {
          _this.cache.local.sendHotKey = 'Ctrl+Enter'
          _this.setSendStatus = false
        }
      },
      closeThisChat: function () {
        var _this = this
        _this.$root.eventHub.$emit('closeChat', _this.cache.currentChatInfo)
      }
    }
  }
</script>
