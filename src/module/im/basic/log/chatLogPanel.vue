<template>
  <div class="chatLogPanel">
    <div v-if="typeof cache.currentChatInfo.groupId === 'undefined'">还未初始化...</div>
    <div v-else class="layim-chat layui-show" :class="cache.msgAll[cache.currentChatInfo.groupId].groupType === 1 ? 'layim-chat-friend' : 'layim-chat-group'">
      <div class="layim-chatLog-main" id="layim-chatLog-main">
        <div v-if="cache.msgAll[cache.currentChatInfo.groupId].logMap[currPage]" v-for="item in cache.msgAll[cache.currentChatInfo.groupId].logMap[currPage]">
          <sysMsg v-if="item.type === 'sys'" :Message="item"></sysMsg>
          <privateMsg v-else :Message="item" v-show="item.status !== 3"></privateMsg>
        </div>
      </div>
    </div>
    <div id="chatLogPages" style="text-align: center; height: 55px;"  class="layui-show"></div>
  </div>
</template>
<script>
  import privateMsg from '../message/privateMsg.vue'
  import sysMsg from '../message/sysMsg.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        skin: '#AF0000',
        groups: 5,
        skip: true,
        currCount: 5, // 当前页显示条数
        count: 30, // 每页显示条数
        sum: 0, // 总条数
        max: 0, // 最大条数
        min: 0, // 最小条数
        currPage: 0, // 当前页数
        seqId: -1, // 查询最大条数
        pages: 0 // 总页数
      }
    },
    components: {
      privateMsg,
      sysMsg
    },
    created: function () {
      var _this = this
      _this.$root.$('body').on('onresize_logPanel', function (e, response) {
        _this.resize()
      })
      _this.eventHub.$on('loadImage', function (msg) {
        if (document.getElementById('layim-chatLog-main')) {
          document.getElementById('layim-chatLog-main').scrollTop = document.getElementById('layim-chatLog-main').scrollHeight
        }
      })
      _this.$watch('cache.currentChatInfo.groupId', function (newVal, oldVal) {
        if (!newVal) {
          return false
        }
        if (_this.cache.msgAll[_this.cache.currentChatInfo.groupId].logMap.maxPage) {
          _this.$delete(_this.cache.msgAll[_this.cache.currentChatInfo.groupId].logMap, _this.cache.msgAll[_this.cache.currentChatInfo.groupId].logMap.maxPage)
        }
        _this.max = _this.cache.msgAll[_this.cache.currentChatInfo.groupId].seq
        _this.min = _this.cache.msgAll[_this.cache.currentChatInfo.groupId].initSeqid
        _this.sum = _this.max - _this.min + 1
        _this.currCount = _this.sum % _this.count
        _this.seqId = _this.max
        _this.currPage = Math.ceil(_this.sum / _this.count)
        _this.pages = Math.ceil(_this.sum / _this.count)
        _this.cache.msgAll[_this.cache.currentChatInfo.groupId].logMap.maxPage = _this.pages
        _this.$root.laypage({
          cont: 'chatLogPages',
          pages: _this.pages,
          curr: _this.currPage,
          skip: _this.skip,
          skin: _this.skin,
          groups: _this.groups,
          jump: function (obj) {
            console.log(obj.curr)
            _this.currPage = obj.curr
            _this.currCount = _this.currPage === _this.pages ? (_this.sum % _this.count) : _this.count
            _this.seqId = _this.currPage === _this.pages ? _this.max : _this.min + (_this.currPage * _this.count) - 1
            _this.showLog({
              groupId: _this.cache.currentChatInfo.groupId,
              currPage: _this.currPage,
              max: _this.seqId,
              min: _this.min,
              currCount: _this.currCount
            })
          }
        })
      })
    },
    methods: {
      resize: function () {
        var _this = this
        var fixedHeight = 43 + 55
        _this.$root.$('#layim-chatLog-main').css({
          height: window.innerHeight - fixedHeight
        })
      },
      showLog: function (obj) {
        var _this = this
        if (!_this.cache.msgAll[obj.groupId].logMap[obj.currPage]) {
          _this.$root.imdemo.conn.pullMsg({
            seqid: obj.max,
            count: obj.currCount,
            initSeq: obj.min,
            groupId: obj.groupId,
            success: function (response) {
              console.log(response)
              _this.pullMsgSuccess(obj.groupId, response, obj.currPage)
            },
            fail: function (response) {
              _this.$root.imdemo.utils.onError({
                code: 'onPullMsgFailedCallback',
                message: '拉取历史消息失败！',
                data: response
              })
            }
          })
        }
      },
      pullMsgSuccess: function (groupId, response, currPage) {
        var _this = this
        var MsgList = response.msgBody.MsgList
        _this.$set(_this.cache.msgAll[groupId].logMap, currPage, [])
        for (var i = 0; i < MsgList.length; i++) {
          var mine = MsgList[i].SenderId === _this.cache.mine.id
          var type = ''
          var content = null
          if (MsgList[i].MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_TEXT) {
            type = 'text'
            content = MsgList[i].MsgBody
          } else if (MsgList[i].MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_IMAGE) {
            type = 'image'
            content = MsgList[i].Image
          } else if (MsgList[i].MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_FILETYPE) {
            type = 'attach'
            content = MsgList[i].File
          } else if (MsgList[i].MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_TIP) {
            type = 'sys'
            content = MsgList[i].MsgBody
          } else {
            console.log('未知的消息类型')
            console.log(MsgList[i])
            continue
          }
          _this.cache.msgAll[groupId].logMap[currPage].unshift({
            mine: mine,
            name: MsgList[i].SenderName,
            sendTime: parseInt(MsgList[i].SendTime.toString()),
            content: content,
            type: type,
            status: 0,
            avatar: MsgList[i].SenderAvatar,
            groupId: groupId
          })
        }
      }
    },
    updated: function () {
      var _this = this
      _this.resize()
      if (document.getElementById('layim-chatLog-main')) {
        document.getElementById('layim-chatLog-main').scrollTop = document.getElementById('layim-chatLog-main').scrollHeight
      }
    }
  }
</script>
<style>
  .chatLogPanel {
    height: 100%;
  }
  .layim-chatLog-main {
    height: 0px;
    padding: 0px 15px 0px 15px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
