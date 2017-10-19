<template>
  <div class="im">
  </div>
</template>
<script>
  import mainPanel from './basic/mainPanel.vue'
  import minPanel from './basic/minPanel.vue'
  import mainChatPanel from './basic/mainChatPanel.vue'
  import mainChatMinPanel from './basic/mainChatMinPanel.vue'
  import chatLogPanel from './basic/chatLogPanel.vue'
  import Vue from 'vue'
  export default {
    data () {
      return {
        mainPanelVue: null,
        minPanelVue: null,
        mainChatPanelVue: null,
        mainChatMinPanelVue: null,
        layimClose: null,
        layimMain: null,
        layimChat: null,
        layimChatMin: null,
        layimChatIndex: null,
        layimChatLog: null,
        chatLogPanelVue: null,
        cache: {
          version: '2.0',
          skin: {
            skin1: require('../../assets/layim/css/modules/layim/skin/1.jpg'),
            skin2: require('../../assets/layim/css/modules/layim/skin/2.jpg'),
            skin3: require('../../assets/layim/css/modules/layim/skin/3.jpg'),
            skin4: require('../../assets/layim/css/modules/layim/skin/4.jpg'),
            skin5: require('../../assets/layim/css/modules/layim/skin/5.jpg')
          },
          tempContent: {},
          currentChatInfo: {},
          newChatList: [],
          chatList: [],
          msgAll: {},
          local: {},
          mine: {},
          friend: {},
          friendGroup: {},
          group: {},
          session: [], // 会话列表对顺序有要求，所以以数组展示
          search: [],
          msgBox: [],
          inviteFriend: [],
          capacity: 200,
          base: {
            initSkin: 'skin2', // 初始化皮肤
            min: false, // 主面板是否最小化
            popmainRight: '10px', // 主面板距离右侧偏移量
            popChatLogLeft: '10px', // 主面板距离右侧偏移量
            chatlistLeft: -100
          }
        }
      }
    },
    components: {
    },
    destroyed: function () {
    },
    created: function () {
      var _this = this
      _this.cache.mine.id = localStorage.getItem('imUserID')
      _this.cache.mine.token = localStorage.getItem(_this.cache.mine.id)
      _this.cache.local = _this.$root.data('layim')[_this.cache.mine.id] || {}
      if (typeof _this.$root.imdemo.conn !== 'undefined') {
        _this.friendList()
        _this.listGroup()
        _this.userinfo()
        _this.friendListMsgBox()
      }
      _this.$root.$('body').off('onEnter')
      _this.$root.$('body').on('onEnter', function (e, response) {
        _this.$root.imdemo.conn.type = 1
        _this.friendList()
        _this.listGroup()
        _this.userinfo()
        _this.friendListMsgBox()
      })
      _this.$root.$('body').off('onLoginSuccessedCallback')
      _this.$root.$('body').on('onLoginSuccessedCallback', function (e, response) {
        if (_this.cache.local.close || _this.cache.base.min) {
          _this.popmin()
        } else {
          _this.popmain()
        }
        _this.popChatLog()
        var headSeqId = _this.$root.imdemo.conn.getUniqueLong()
        _this.$root.imdemo.connMap[headSeqId] = {
          type: 1
        }
        _this.$root.imdemo.conn.pullSession({
          headSeqId: headSeqId,
          userCode: _this.cache.mine.id,
          recentDays: 0
        })
      })
      _this.$root.$('body').off('onPostReadSeqCallback')
      _this.$root.$('body').on('onPostReadSeqCallback', function (e, response) {
        if (response.msgBody.ErrorCode === 0) {
          var groupId = response.msgBody.GroupID
          _this.cache.msgAll[groupId].readSeqid = parseInt(response.msgBody.seqid)
          _this.cache.msgAll[groupId].unread = 0
        } else {
          console.log('上报最大阅读数失败' + _this.$root.imdemo.connMap[response.seqid].groupId)
        }
      })
      _this.$root.$('body').off('onPullSessionCallback_1')
      _this.$root.$('body').on('onPullSessionCallback_1', function (e, response) {
        _this.cache.session = []
        var timeoutMsgArray = []
        if (response.msgBody.ErrorCode === 0) {
          for (var i = 0; i < response.msgBody.SessionList.length; i++) {
            var basicInfo = null
            var lastMsg = ''
            var filter = false
            var item = response.msgBody.SessionList[i]
            var groupId = item.GroupId
            var initSeqid = parseInt(item.InitSeqid)
            var readSeqid = parseInt(item.ReadSeqid)
            var seq = parseInt(item.Seq)
            var unread = initSeqid < readSeqid ? (seq - readSeqid) : (seq - initSeqid)
            unread = unread <= 0 ? 0 : unread
            if (item.GroupType === 1) {
              if (typeof _this.cache.msgAll[groupId] === 'undefined') {
                filter = true
                console.log('这是个不在好友列表的私聊（来自群组），也可能是已除去好友关系个人的聊天，暂不处理这类聊天')
              } else {
                basicInfo = _this.cache.msgAll[groupId].basicInfo
                if (item.LastMsgType === 6) {
                  lastMsg = '系统消息:' + item.LastMsg
                } else {
                  lastMsg = (item.LastSenderId === _this.cache.mine.id ? item.LastMsg : item.LastSenderName + ':' + item.LastMsg)
                }
              }
            } else if (item.GroupType === 2) {
              if (typeof _this.cache.msgAll[groupId] === 'undefined') {
                filter = true
                console.log('这是个已退群的的群组聊天，暂不处理这类聊天')
              } else {
                basicInfo = _this.cache.msgAll[groupId].basicInfo
                if (item.LastMsgType === 6) {
                  lastMsg = '系统消息:' + item.LastMsg
                } else {
                  lastMsg = (item.LastSenderId === _this.cache.mine.id ? item.LastMsg : item.LastSenderName + ':' + item.LastMsg)
                }
              }
            } else if (item.GroupType === 4) {
              // 小秘书
              filter = true
            } else if (item.GroupType === 5) {
              // 广播
              filter = true
            } else {
              // 未知类型
              filter = true
            }
            if (filter) {
              console.log('小秘书和广播:' + groupId)
              continue
            }
            _this.cache.session.push({
              avatar: basicInfo.avatar,
              groupName: item.GroupName,
              lastMsg: lastMsg,
              groupType: item.GroupType,
              groupId: groupId
            })
            timeoutMsgArray = []
            _this.$set(_this.cache.msgAll, groupId, {
              seq: seq,
              readSeqid: readSeqid,
              unread: unread,
              initSeqid: initSeqid,
              msgArray: timeoutMsgArray,
              groupType: item.GroupType,
              basicInfo: basicInfo,
              pullMsg: false,
              pullSession: true,
              allowTalk: true
            })
          }
        } else {
          console.log('无会话,这是个新的账户')
        }
      })
      _this.$root.$('body').off('onPullSessionCallback_2')
      _this.$root.$('body').on('onPullSessionCallback_2', function (e, response) {
        var groupId = _this.$root.imdemo.connMap[response.seqid].groupId
        var groupType = _this.$root.imdemo.connMap[response.seqid].groupType
        var timeoutMsgArray = []
        var basicInfo = null
        // console.log(response.msgBody.SessionList)
        if (response.msgBody.ErrorCode === 0) {
          for (var i = 0; i < response.msgBody.SessionList.length; i++) {
            var item = response.msgBody.SessionList[i]
            var filter = false
            if (item.GroupType === 1) {
              // 私人
              filter = false
              basicInfo = _this.cache.msgAll[groupId].basicInfo
            } else if (item.GroupType === 2) {
              // 群组
              filter = false
              basicInfo = _this.cache.msgAll[groupId].basicInfo
            } else if (item.GroupType === 4) {
              // 小秘书
              filter = true
            } else if (item.GroupType === 5) {
              // 广播
              filter = true
            } else {
              // 未知类型
              filter = true
            }
            if (filter) {
              console.log('小秘书和广播:' + groupId)
              continue
            }
            var initSeqid = parseInt(item.InitSeqid)
            var readSeqid = parseInt(item.ReadSeqid)
            var seq = parseInt(item.Seq)
            var unread = initSeqid < readSeqid ? (seq - readSeqid) : (seq - initSeqid)
            unread = unread <= 0 ? 0 : unread
            _this.$set(_this.cache.msgAll, groupId, {
              seq: seq,
              readSeqid: readSeqid,
              unread: unread,
              initSeqid: initSeqid,
              msgArray: timeoutMsgArray,
              groupType: groupType,
              pullMsg: false,
              basicInfo: basicInfo,
              pullSession: true,
              allowTalk: true
            })
            _this.pullMsg()
          }
          if (response.msgBody.SessionList.length === 0) {
            console.log('无会话,这个聊天对象似乎有些问题')
            _this.$set(_this.cache.msgAll, groupId, {
              seq: 0,
              readSeqid: 0,
              unread: 0,
              initSeqid: 0,
              msgArray: timeoutMsgArray,
              groupType: groupType,
              basicInfo: basicInfo,
              pullMsg: false,
              pullSession: true,
              allowTalk: true
            })
          }
        } else {
          console.log('无会话,这个聊天对象似乎有些问题')
          _this.$set(_this.cache.msgAll, groupId, {
            seq: 0,
            readSeqid: 0,
            unread: 0,
            initSeqid: 0,
            msgArray: timeoutMsgArray,
            groupType: groupType,
            basicInfo: basicInfo,
            pullMsg: false,
            pullSession: true,
            allowTalk: true
          })
        }
      })
      _this.$root.$('body').off('onPullMsgCallback_1')
      _this.$root.$('body').on('onPullMsgCallback_1', function (e, response) {
        var groupId = _this.$root.imdemo.connMap[response.seqid].groupId
        _this.cache.msgAll[groupId].pullMsg = true
        if (response.msgBody.ErrorCode === 0) {
          var MsgList = response.msgBody.MsgList
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
            _this.cache.msgAll[groupId].msgArray.unshift({
              mine: mine,
              name: MsgList[i].SenderName,
              sendTime: parseInt(MsgList[i].SendTime.toString()),
              content: content,
              type: type,
              status: 0,
              avatar: MsgList[i].SenderAvatar,
              groupId: MsgList[i].GroupId
            })
          }
        } else {
          console.log('无消息')
        }
      })
      _this.$root.$('body').off('onMessageTimeoutCallback_303')
      _this.$root.$('body').on('onMessageTimeoutCallback_303', function (e, response) {
        if (_this.$root.imdemo.connMap[response.msgId].status === 1) {
          var position = _this.$root.imdemo.connMap[response.msgId].position
          var groupId = _this.$root.imdemo.connMap[response.msgId].groupId
          _this.cache.msgAll[groupId].msgArray[position].status = 2
        }
      })
      _this.$root.$('body').off('onTextMessageAnswerCallback')
      _this.$root.$('body').on('onTextMessageAnswerCallback', function (e, response) {
        var position = _this.$root.imdemo.connMap[response.msgBody.MsgId].position
        var groupId = _this.$root.imdemo.connMap[response.msgBody.MsgId].groupId
        var lastMsg = _this.$root.imdemo.connMap[response.msgBody.MsgId].msgBody
        if (response.msgBody.ErrorCode === 0) {
          _this.cache.msgAll[groupId].seq = parseInt(response.msgBody.Seq)
          _this.cache.msgAll[groupId].msgArray[position].status = 0
          _this.cache.msgAll[groupId].msgArray[position].sendTime = parseInt(response.msgBody.LastTime.toString())
        } else {
          _this.cache.msgAll[groupId].msgArray[position].status = 2
        }
        var sessionPosition = -1
        for (var i = 0; i < _this.cache.session.length; i++) {
          if (_this.cache.session[i].groupId === groupId) {
            sessionPosition = i
            break
          }
        }
        if (sessionPosition >= 0) {
          _this.cache.session.splice(sessionPosition, 1)
        }
        _this.cache.session.unshift({
          avatar: _this.cache.msgAll[groupId].basicInfo.avatar,
          groupName: _this.cache.msgAll[groupId].basicInfo.userName,
          lastMsg: lastMsg,
          groupType: _this.cache.msgAll[groupId].groupType,
          groupId: groupId
        })
        var chatListPosition = -1
        for (var j = 0; j < _this.cache.chatList.length; j++) {
          if (_this.cache.chatList[j].groupId === groupId) {
            chatListPosition = j
            break
          }
        }
        if (chatListPosition >= 0) {
          _this.cache.chatList.splice(chatListPosition, 1)
        }
        _this.cache.chatList.unshift({
          groupId: groupId
        })
      })
      _this.$root.$('body').off('onTextMessageReceiveCallback')
      _this.$root.$('body').on('onTextMessageReceiveCallback', function (e, response) {
        var filter = false
        var lastMsg = ''
        var groupId = response.msgBody.GroupId
        if (response.msgBody.GroupType === 1) {
          if (typeof _this.cache.msgAll[groupId] === 'undefined' || !_this.cache.msgAll[groupId].allowTalk) {
            filter = true
            console.log('这是个不在好友列表的私聊（来自群组），也可能是已除去好友关系个人的聊天，暂不处理这类聊天')
          } else {
            if (response.msgBody.MsgType === 6) {
              lastMsg = '系统消息:' + response.msgBody.MsgBody
            } else {
              lastMsg = (response.msgBody.SenderId === _this.cache.mine.id ? response.msgBody.MsgBody : response.msgBody.SenderName + ':' + response.msgBody.MsgBody)
            }
          }
        } else if (response.msgBody.GroupType === 2) {
          if (typeof _this.cache.msgAll[groupId] === 'undefined' || !_this.cache.msgAll[groupId].allowTalk) {
            filter = true
            console.log('这是个已退群的的群组聊天，暂不处理这类聊天')
          } else {
            if (response.msgBody.MsgType === 6) {
              lastMsg = '系统消息:' + response.msgBody.MsgBody
            } else {
              lastMsg = (response.msgBody.SenderId === _this.cache.mine.id ? response.msgBody.MsgBody : response.msgBody.SenderName + ':' + response.msgBody.MsgBody)
            }
          }
        } else if (response.msgBody.GroupType === 4) {
          // 小秘书
          filter = true
        } else if (response.msgBody.GroupType === 5) {
          // 广播
          filter = true
        } else {
          // 其它类型
          filter = true
        }
//        console.log(response)
        if (filter) {
          console.log('小秘书和广播:' + groupId)
          return false
        }
        var position = -1
        for (var i = 0; i < _this.cache.session.length; i++) {
          if (_this.cache.session[i].groupId === groupId) {
            position = i
            break
          }
        }
        if (position >= 0) {
          _this.cache.session.splice(position, 1)
        }
        _this.cache.session.unshift({
          avatar: _this.cache.msgAll[groupId].basicInfo.avatar,
          groupName: _this.cache.msgAll[groupId].basicInfo.userName,
          lastMsg: lastMsg,
          groupType: response.msgBody.GroupType,
          groupId: groupId
        })
        var chatListPosition = -1
        for (var j = 0; j < _this.cache.chatList.length; j++) {
          if (_this.cache.chatList[j].groupId === groupId) {
            chatListPosition = j
            break
          }
        }
        if (chatListPosition >= 0) {
          _this.cache.chatList.splice(chatListPosition, 1)
          _this.cache.chatList.unshift({
            groupId: groupId
          })
        } else {
          var newChatListPosition = -1
          for (var k = 0; k < _this.cache.newChatList.length; k++) {
            if (_this.cache.newChatList[k].groupId === groupId) {
              newChatListPosition = k
              break
            }
          }
          if (newChatListPosition >= 0) {
            _this.cache.newChatList.splice(newChatListPosition, 1)
          }
          _this.cache.newChatList.unshift({
            groupId: groupId
          })
          _this.setChatMin()
        }
        _this.cache.msgAll[groupId].seq = parseInt(response.msgBody.MsgSeqId)
        if (_this.cache.currentChatInfo.groupId === groupId && _this.layimChat && _this.layimChat.is(':visible')) {
          // 当前聊天对象收到信息，啥也不做
        } else {
          _this.cache.msgAll[groupId].unread = _this.cache.msgAll[groupId].unread + 1
        }
        if (!_this.cache.msgAll[groupId].pullMsg) {
          console.log('还没开始拉取消息' + groupId)
          if (chatListPosition > -1) {
            _this.pullMsg()
          }
          return false
        }
        var msg = {
          name: response.msgBody.SenderName,
          sendTime: parseInt(response.msgBody.SendTime.toString()),
          avatar: response.msgBody.SenderAvatar,
          mine: response.msgBody.SenderId === _this.cache.mine.id,
          groupId: groupId,
          status: 0
        }
        if (response.msgBody.MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_TEXT) {
          msg.type = 'text'
          msg.content = response.msgBody.MsgBody
        } else if (response.msgBody.MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_IMAGE) {
          msg.type = 'image'
          msg.content = response.msgBody.Image
        } else if (response.msgBody.MsgType === _this.$root.webim_code.WEBIM_MSG_TYPE_FILETYPE) {
          msg.type = 'attach'
          msg.content = response.msgBody.File
        } else {
          console.log('其他类型暂不处理')
        }
        _this.cache.msgAll[groupId].msgArray.push(msg)
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_1')
      _this.$root.$('body').on('onPushCustomProtocolCallback_1', function (e, response) {
        _this.friendListMsgBox()
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_2')
      _this.$root.$('body').on('onPushCustomProtocolCallback_2', function (e, response) {
        _this.friendList()
        _this.cache.msgAll[response.msgBody.GroupId].allowTalk = false
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_3')
      _this.$root.$('body').on('onPushCustomProtocolCallback_3', function (e, response) {
        var msgBoxPosition = -1
        for (var i = 0; i < _this.cache.msgBox.length; i++) {
          if (_this.cache.msgBox[i].groupId === response.msgBody.GroupId) {
            msgBoxPosition = i
            break
          }
        }
        // 同步自己的添加好友透传信息
        if (msgBoxPosition > -1) {
          _this.cache.msgBox.splice(msgBoxPosition, 1)
          _this.friendList()
        } else {
          _this.friendList()
        }
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_5')
      _this.$root.$('body').on('onPushCustomProtocolCallback_5', function (e, response) {
        _this.listGroup()
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_6')
      _this.$root.$('body').on('onPushCustomProtocolCallback_6', function (e, response) {
        _this.listGroup()
        _this.cache.msgAll[response.msgBody.GroupId].allowTalk = false
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_9')
      _this.$root.$('body').on('onPushCustomProtocolCallback_9', function (e, response) {
        _this.listGroup()
        var groupMemberList = []
        _this.listGroupMember(response.msgBody.GroupId, groupMemberList)
        var groupMemberListPosition = -1
        for (var i = 0; i < groupMemberList.length; i++) {
          if (groupMemberList[i].imUserID === _this.cache.mine.id) {
            groupMemberListPosition = i
            break
          }
        }
        if (groupMemberListPosition === -1) {
          _this.cache.msgAll[response.msgBody.GroupId].allowTalk = false
        }
      })
      _this.$root.$('body').off('onPushCustomProtocolCallback_11')
      _this.$root.$('body').on('onPushCustomProtocolCallback_11', function (e, response) {
        _this.listGroup()
      })
      _this.$root.$('body').off('onbeforeunload_im')
      _this.$root.$('body').on('onbeforeunload_im', function (e, response) {
        _this.$root.data('layim', {
          key: _this.cache.mine.id,
          value: _this.cache.local
        })
        if (_this.layimChat && _this.layimChat.is(':visible')) {
          _this.postReadSeq({
            groupId: _this.cache.currentChatInfo.groupId
          })
        }
      })
      _this.$root.eventHub.$on('skinChange', function () {
        try {
          if (_this.layimMain) {
            _this.layimMain.css({
              'background-image': _this.cache.local.skin ? 'url(' + _this.cache.skin[_this.cache.local.skin] + ')' : 'none'
            })
          }
          if (_this.layimChat) {
            _this.layimChat.css({
              'background-image': _this.cache.local.skin ? 'url(' + _this.cache.skin[_this.cache.local.skin] + ')' : 'none'
            })
          }
          if (_this.layimChatLog) {
            _this.layimChatLog.css({
              'background-image': _this.cache.local.skin ? 'url(' + _this.cache.skin[_this.cache.local.skin] + ')' : 'none'
            })
          }
        } catch (e) {
          console.log('换肤失败')
        }
      })
      _this.eventHub.$on('mineMessage', function (msg) {
        if (!_this.cache.msgAll[msg.groupId].allowTalk) {
          console.log('已经删除好友关系或者已经退群的聊天')
          msg.status = 2
          _this.cache.msgAll[msg.groupId].msgArray.push(msg)
          var content = ''
          if (_this.cache.msgAll[msg.groupId].groupType === 1) {
            content = '你们已经不是好友关系'
          } else if (_this.cache.msgAll[msg.groupId].groupType === 2) {
            content = '你已经不是群成员'
          }
          _this.cache.msgAll[msg.groupId].msgArray.push({
            type: 'sys',
            content: content
          })
          return false
        }
        _this.cache.msgAll[msg.groupId].msgArray.push(msg)
        var msgId = _this.$root.imdemo.conn.getUniqueId()
        _this.$root.imdemo.connMap[msgId] = {
          position: _this.cache.msgAll[msg.groupId].msgArray.length - 1,
          groupId: msg.groupId,
          status: msg.status
        }
        var options = {
          msgId: msgId,
          userCode: _this.cache.mine.id,
          touid: _this.cache.msgAll[msg.groupId].groupType === 1 ? _this.cache.msgAll[msg.groupId].basicInfo.friendImID : msg.groupId,
          userName: _this.cache.mine.userName,
          avatar: _this.cache.mine.avatar,
          groupName: _this.cache.msgAll[msg.groupId].basicInfo.userName,
          groupId: msg.groupId,
          groupType: _this.cache.msgAll[msg.groupId].groupType
        }
        if (msg.type === 'text') {
          options.msgType = _this.$root.webim_code.WEBIM_MSG_TYPE_TEXT
          options.msgBody = msg.content
        } else if (msg.type === 'image') {
          options.msgType = _this.$root.webim_code.WEBIM_MSG_TYPE_IMAGE
          options.imageId = msg.content.ImageId
          options.imageName = msg.content.ImageName
          options.imageType = 1
          options.imageUrl = msg.content.ImageUrl
          options.imageSize = msg.content.ImageSize
          options.imageW = 20
          options.imageH = 20
          options.msgBody = '[图片]'
        } else if (msg.type === 'attach') {
          options.msgType = _this.$root.webim_code.WEBIM_MSG_TYPE_FILETYPE
          options.fileId = msg.content.FileId
          options.fileName = msg.content.FileName
          options.fileType = 1
          options.fileUrl = msg.content.FileUrl
          options.fileSize = msg.content.FileSize
          options.msgBody = '[文件]'
        } else {
          options.msgType = _this.$root.webim_code.WEBIM_MSG_TYPE_TEXT
          options.msgBody = ''
          console.log('未知消息类型')
        }
        _this.$root.imdemo.connMap[msgId].msgBody = options.msgBody
        _this.$root.imdemo.conn.sendMessage(options)
      })
      _this.$root.eventHub.$on('closeChat', function (chatListItem) {
        if (_this.cache.chatList.length === 1) {
          _this.closeChat()
          return false
        }
        _this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openChatLog = false
        var position = -1
        for (var i = 0; i < _this.cache.chatList.length; i++) {
          if (_this.cache.chatList[i].groupId === chatListItem.groupId) {
            position = i
            break
          }
        }
        if (_this.cache.currentChatInfo.groupId === chatListItem.groupId) {
          if (position > 0) {
            _this.cache.currentChatInfo = _this.cache.chatList[position - 1]
          } else {
            _this.cache.currentChatInfo = _this.cache.chatList[position + 1]
          }
        }
        _this.cache.chatList.splice(position, 1)
        _this.postReadSeq({
          groupId: chatListItem.groupId
        })
        _this.postReadSeq({
          groupId: _this.cache.currentChatInfo.groupId
        })
        _this.popchat()
      })
      _this.$root.eventHub.$on('chat', function (basicInfo) {
        // _this.$set(_this.cache, 'currentChatInfo', basicInfo)
        _this.cache.currentChatInfo = basicInfo
        var chatListPosition = -1
        for (var i = 0; i < _this.cache.chatList.length; i++) {
          if (_this.cache.chatList[i].groupId === basicInfo.groupId) {
            chatListPosition = i
            break
          }
        }
        if (chatListPosition === -1) {
          _this.cache.chatList.push({
            groupId: basicInfo.groupId
          })
        }
        var newChatListPosition = -1
        for (var j = 0; j < _this.cache.newChatList.length; j++) {
          if (_this.cache.newChatList[j].groupId === basicInfo.groupId) {
            newChatListPosition = j
            break
          }
        }
        if (newChatListPosition >= 0) {
          _this.cache.newChatList.splice(newChatListPosition, 1)
        }
        _this.popchat()
      })
      _this.$root.eventHub.$on('changeChat', function (basicInfo) {
        _this.postReadSeq({
          groupId: _this.cache.currentChatInfo.groupId
        })
        _this.postReadSeq({
          groupId: basicInfo.groupId
        })
        _this.cache.currentChatInfo = basicInfo
        _this.pullMsg()
      })
      _this.$watch('cache.msgAll', function (newVal, oldVal) {
        if (_this.layimChatMin) {
          if (_this.cache.newChatList.length > 0 && _this.cache.msgAll[_this.cache.newChatList[0].groupId].unread > 0) {
            _this.layimChatMin.addClass('layim-new-message')
          } else {
            _this.layimChatMin.removeClass('layim-new-message')
          }
        }
      }, {
        deep: true
      })
      _this.$watch('cache.currentChatInfo.groupId', function (newVal, oldVal) {
        if (typeof newVal === 'undefined') {
          _this.layimChatLog.hide()
          return false
        }
        if (_this.cache.msgAll[newVal].basicInfo.openChatLog) {
          _this.layimChatLog.show()
        } else {
          _this.layimChatLog.hide()
        }
      })
    },
    methods: {
      popmin: function () {
        var _this = this
        if (_this.layimClose) {
          _this.layimClose.show()
          return false
        }
        _this.$root.layer.open({
          type: 1,
          title: false,
          area: ['168px', '52px'],
          id: 'layui-layim-close',
          skin: 'layui-box layui-layim-min layui-layim-close',
          shade: false,
          closeBtn: false,
          anim: 2,
          offset: 'rb',
          resize: false,
          content: '<div id="minPanelContainer"></div>',
          move: '#layui-layim-close img',
          success: function (layero, index) {
            _this.minPanelVue = new Vue({
              template: '<minPanel/>',
              components: { minPanel }
            })
            _this.minPanelVue.$mount('#minPanelContainer')
            _this.layimClose = layero
            if (_this.cache.base.popmainRight) {
              layero.css('margin-left', '-' + _this.cache.base.popmainRight)
            }
            layero.on('click', function () {
              _this.layimClose.hide()
              _this.popmain()
              delete _this.cache.local.close
            })
          }
        })
      },
      popmain: function () {
        var _this = this
        if (_this.layimMain) {
          _this.layimMain.show()
          return false
        }
        _this.$root.layer.open({
          type: 1,
          area: ['260px', '520px'],
          skin: 'layui-box layui-layim',
          title: '&#8203;',
          offset: 'rb',
          id: 'layui-layim',
          shade: false,
          anim: 2,
          resize: false,
          content: '<div id="mainPanelContainer"></div>',
          success: function (layero) {
            _this.mainPanelVue = new Vue({
              template: '<mainPanel :cache="cache"/>',
              components: { mainPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.mainPanelVue.$mount('#mainPanelContainer')
            _this.layimMain = layero
            _this.setSkin(layero)
            if (_this.cache.base.popmainRight) {
              layero.css('margin-left', '-' + _this.cache.base.popmainRight)
            }
            _this.layimMain.on('contextmenu', function (event) {
              event.cancelBubble = true
              event.returnValue = false
              return false
            })
          },
          cancel: function (index) {
            _this.layimMain.hide()
            _this.popmin()
            _this.cache.local.close = true
            return false
          }
        })
      },
      popchat: function () {
        var _this = this
        if (_this.layimChatMin !== null && _this.cache.newChatList.length === 0) {
          _this.layimChatMin.hide()
        }
        if (_this.layimChat !== null) {
          var hasFull = _this.layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin')
          var list = _this.layimChat.find('.layim-chat-list')
          var chatBox = _this.layimChat.find('.layim-chat-box')
          if (_this.cache.chatList.length > 1) {
            hasFull || _this.layimChat.css('width', 800)
            list.css({
              height: _this.layimChat.height()
            }).show()
            chatBox.css('margin-left', '200px')
          } else {
            list.css({
              height: _this.layimChat.height()
            }).show()
            list.hide()
            if (!hasFull) {
              _this.layimChat.css('width', '600px')
            }
            chatBox.css('margin-left', 0)
          }
          _this.layimChat.css({
            left: Math.ceil((_this.$root.$(window).width() - _this.layimChat.width()) / 2) - (_this.cache.chatList.length > 1 && !hasFull ? _this.cache.base.chatlistLeft : 0)
          })
          _this.layimChat.show()
          _this.pullMsg()
          return false
        }
        _this.layimChatIndex = _this.$root.layer.open({
          type: 1,
          area: ['600px', '520px'],
          skin: 'layui-box layui-layim-chat layimChat',
          id: 'layui-layim-chat',
          title: '&#8203;',
          shade: false,
          maxmin: true,
          offset: 'auto',
          anim: 0,
          closeBtn: 1,
          content: '<div id="mainChatPanelContainer"></div>',
          success: function (layero) {
            _this.mainChatPanelVue = new Vue({
              template: '<mainChatPanel :cache="cache"/>',
              components: { mainChatPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.mainChatPanelVue.$mount('#mainChatPanelContainer')
            _this.layimChat = layero
            layero.css({
              'min-width': '500px',
              'min-height': '420px'
            })
            _this.setSkin(layero)
            var hasFull = _this.layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin')
            var list = _this.layimChat.find('.layim-chat-list')
            var chatBox = _this.layimChat.find('.layim-chat-box')
            if (_this.cache.chatList.length > 1) {
              hasFull || _this.layimChat.css('width', 800)
              list.css({
                height: _this.layimChat.height()
              }).show()
              chatBox.css('margin-left', '200px')
            }
            _this.layimChat.css({
              left: Math.ceil((_this.$root.$(window).width() - _this.layimChat.width()) / 2) - (_this.cache.chatList.length > 1 && !hasFull ? _this.cache.base.chatlistLeft : 0)
            })
            _this.pullMsg()
          },
          full: function (layero) {
            _this.$root.layer.style(_this.layimChatIndex, {
              width: '100%',
              height: '100%'
            }, true)
            _this.resizeChat()
          },
          resizing: _this.resizeChat,
          restore: _this.resizeChat,
          min: function () {
            _this.layimChat.hide()
            for (var i = 0; i < _this.cache.chatList.length; i++) {
              _this.cache.newChatList.push(_this.cache.chatList[i])
            }
            _this.cache.chatList = []
            _this.setChatMin()
            return false
          },
          end: function () {
            _this.$root.layer.closeAll('tips')
            _this.closeChat()
          }
        })
      },
      popChatLog: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          maxmin: true,
          title: '聊天记录',
          area: ['450px', '100%'],
          shade: false,
          offset: 'lb',
          skin: 'layui-box layimChatLog',
          anim: 2,
          id: 'layui-layim-chatlog',
          resize: false,
          content: '<div id="chatLogPanelContainer"></div>',
          success: function (layero) {
            _this.chatLogPanelVue = new Vue({
              template: '<chatLogPanel :cache="cache"/>',
              components: { chatLogPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.chatLogPanelVue.$mount('#chatLogPanelContainer')
            _this.layimChatLog = layero
            _this.setSkin(layero)
            if (_this.cache.base.popChatLogLeft) {
              layero.css('margin-left', _this.cache.base.popChatLogLeft)
            }
            _this.layimChatLog.hide()
          },
          cancel: function (index) {
            _this.layimChatLog.hide()
            _this.cache.msgAll[_this.cache.currentChatInfo.groupId].basicInfo.openChatLog = false
            return false
          }
        })
      },
      closeChat: function () {
        var _this = this
        _this.postReadSeq({
          groupId: _this.cache.currentChatInfo.groupId
        })
        if (_this.layimChat != null) {
          _this.$root.layer.close(_this.layimChat.attr('times'))
          _this.layimChat = null
          _this.$root.eventHub.$emit('closeChatMax', {})
        }
        if (_this.layimChatMin != null && _this.cache.newChatList.length === 0) {
          _this.$root.layer.close(_this.layimChatMin.attr('times'))
          _this.layimChatMin = null
          _this.$root.eventHub.$emit('closeChatMin', {})
        }
        for (var i = 0; i < _this.cache.chatList.length; i++) {
          _this.cache.msgAll[_this.cache.chatList[i].groupId].basicInfo.openChatLog = false
        }
        _this.cache.chatList = []
        _this.cache.currentChatInfo = {}
      },
      setChatMin: function () {
        var _this = this
        if (_this.layimChatMin) {
          _this.layimChatMin.show()
          return false
        }
        _this.$root.layer.open({
          type: 1,
          title: false,
          skin: 'layui-box layui-layim-min',
          shade: false,
          closeBtn: false,
          anim: 2,
          offset: 'b',
          move: '#layui-layim-min',
          resize: false,
          area: ['182px', '50px'],
          content: '<div id="mainChatMinPanelContainer"></div>',
          success: function (layero, index) {
            _this.mainChatMinPanelVue = new Vue({
              template: '<mainChatMinPanel :cache="cache"/>',
              components: { mainChatMinPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.mainChatMinPanelVue.$mount('#mainChatMinPanelContainer')
            _this.layimChatMin = layero
            if (_this.cache.base.minRight) {
              _this.$root.layer.style(index, {
                left: _this.$root.$(window).width() - layero.outerWidth() - parseFloat(_this.cache.base.minRight)
              })
            }
            layero.on('click', function () {
              _this.layimChatMin.hide()
              _this.cache.currentChatInfo = _this.cache.newChatList[0]
              for (var i = _this.cache.newChatList.length - 1; i >= 0; i--) {
                _this.cache.chatList.unshift(_this.cache.newChatList[i])
              }
              _this.cache.newChatList = []
              _this.popchat()
            })
          }
        })
      },
      postReadSeq: function (msg) {
        var _this = this
        if (_this.cache.msgAll[msg.groupId].seq > _this.cache.msgAll[msg.groupId].readSeqid) {
          console.log('上报最大阅读数' + msg.groupId)
          var headSeqId = _this.$root.imdemo.conn.getUniqueLong()
          _this.$root.imdemo.connMap[headSeqId] = {
            seqId: _this.cache.msgAll[msg.groupId].seq,
            groupId: msg.groupId
          }
          var options = {
            headSeqId: headSeqId,
            userCode: _this.cache.mine.id,
            groupId: msg.groupId,
            seqid: _this.cache.msgAll[msg.groupId].seq
          }
          _this.$root.imdemo.conn.postReadSeq(options)
        }
      },
      pullMsg: function () {
        var _this = this
        var headSeqId = null
        var groupId = _this.cache.currentChatInfo.groupId
        if (!_this.cache.msgAll[groupId].pullSession) {
          console.log('在拉取全部会话的时候没有拉取到这个聊天对象的会话,指定获取一次')
          headSeqId = _this.$root.imdemo.conn.getUniqueLong()
          _this.$root.imdemo.connMap[headSeqId] = {
            type: 2,
            groupId: groupId,
            groupType: _this.cache.msgAll[groupId].groupType
          }
          _this.$root.imdemo.conn.pullSession({
            headSeqId: headSeqId,
            userCode: _this.cache.mine.id,
            sessionCode: groupId
          })
        } else {
          if (!_this.cache.msgAll[groupId].pullMsg) {
            headSeqId = _this.$root.imdemo.conn.getUniqueLong()
            _this.$root.imdemo.connMap[headSeqId] = {
              type: 1,
              groupId: groupId
            }
            var unread = _this.cache.msgAll[groupId].unread
            var count = unread > 5 ? 5 : unread
            count = count > 0 ? count : 3
            _this.$root.imdemo.conn.pullMsg({
              headSeqId: headSeqId,
              userCode: _this.cache.mine.id,
              seqid: -1,
              count: count,
              initSeq: _this.cache.msgAll[groupId].initSeqid,
              groupId: groupId
            })
          }
          _this.postReadSeq({
            groupId: groupId
          })
        }
      },
      setSkin: function (layero) {
        var _this = this
        var skin = _this.cache.local.skin
        layero.css({
          'background-image': skin ? 'url(' + _this.cache.skin[skin] + ')' : (_this.cache.base.initSkin ? 'url(' + _this.cache.skin[_this.cache.base.initSkin] + ')' : 'none')
        })
      },
      resizeChat: function () {
        var _this = this
        var hasFull = _this.layimChat.find('.layui-layer-max').hasClass('layui-layer-maxmin')
        var chatBox = _this.layimChat.find('.layim-chat-box')
        var list = _this.layimChat.find('.layim-chat-list')
        var chatMain = _this.layimChat.find('.layim-chat-main')
        var chatHeight = _this.layimChat.height()
        list.css({
          height: chatHeight
        })
        chatMain.css({
          height: chatHeight - 20 - 80 - 158
        })
        if (_this.cache.chatList.length > 1) {
          hasFull || _this.layimChat.css('width', 800)
          chatBox.css('margin-left', '200px')
        } else {
          if (!hasFull) {
            _this.layimChat.css('width', '600px')
          }
          chatBox.css('margin-left', 0)
        }
        _this.layimChat.css({
          left: Math.ceil((_this.$root.$(window).width() - _this.layimChat.width()) / 2) - (_this.cache.chatList.length > 1 && !hasFull ? _this.cache.base.chatlistLeft : 0)
        })
      },
      friendList: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'friend/friendList',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            state: 0
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              var friendList = []
              for (var i = 0; i < data.data.length; i++) {
                var groupId = _this.$root.imdemo.conn.generateRouteid(_this.cache.mine.id, data.data[i].friendImID)
                _this.cache.friendGroup[groupId] = {
                  spread: 'friendGroup1'
                }
                data.data[i].groupId = groupId
                data.data[i].openChatLog = false
                data.data[i].imUserID = data.data[i].friendImID
                _this.$set(_this.cache.msgAll, groupId, {
                  seq: 0,
                  readSeqid: 0,
                  unread: 0,
                  initSeqid: 0,
                  msgArray: [],
                  groupType: 1,
                  basicInfo: data.data[i],
                  pullMsg: false,
                  pullSession: false,
                  allowTalk: true
                })
              }
              friendList = data.data
              _this.cache.friend = {
                'friendGroup1': {
                  groupName: '我的好友',
                  id: 1,
                  list: friendList
                }
              }
            } else {
              _this.$root.layer.msg(data.code + ' : ' + data.msg)
            }
            console.log(_this.cache.friend)
          }
        })
      },
      friendListMsgBox: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'friend/friendList',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            state: 1
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              for (var i = 0; i < data.data.length; i++) {
                var groupId = _this.$root.imdemo.conn.generateRouteid(_this.cache.mine.id, data.data[i].friendImID)
                _this.cache.friendGroup[groupId] = {
                  spread: 'friendGroup1'
                }
                data.data[i].groupId = groupId
                data.data[i].openChatLog = false
                data.data[i].imUserID = data.data[i].friendImID
                data.data[i].msgBoxContent = '申请添加你为好友'
                data.data[i].type = 'addFriend'
                _this.$set(_this.cache.msgAll, groupId, {
                  seq: 0,
                  readSeqid: 0,
                  unread: 0,
                  initSeqid: 0,
                  msgArray: [],
                  groupType: 1,
                  basicInfo: data.data[i],
                  pullMsg: false,
                  pullSession: false,
                  allowTalk: true
                })
              }
              _this.cache.msgBox = data.data
            } else {
              _this.$root.layer.msg(data.code + ' : ' + data.msg)
            }
            console.log(_this.cache.msgBox)
          }
        })
      },
      listGroup: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'group/listGroup',
          data: JSON.stringify({
            uid: _this.cache.mine.id
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              var groupList = []
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].groupId = data.data[i].groupImID
                data.data[i].openGroupMembers = false
                data.data[i].openChatLog = false
                data.data[i].userName = data.data[i].groupName
                _this.$set(_this.cache.msgAll, data.data[i].groupImID, {
                  seq: 0,
                  readSeqid: 0,
                  unread: 0,
                  initSeqid: 0,
                  msgArray: [],
                  groupType: 2,
                  basicInfo: data.data[i],
                  pullMsg: false,
                  pullSession: false,
                  allowTalk: true
                })
              }
              groupList = data.data
              _this.cache.group = groupList
            } else {
              _this.$root.layer.msg(data.code + ' : ' + data.msg)
            }
            console.log(_this.cache.group)
          }
        })
      },
      listGroupMember: function (groupId, groupMemberList) {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'group/listGroupMember',
          data: JSON.stringify({
            groupId: groupId
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              groupMemberList = data
            } else {
              _this.$root.layer.msg(data.code + ' : ' + data.msg)
            }
            console.log(groupMemberList)
          }
        })
      },
      userinfo: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'user/userinfo',
          data: JSON.stringify({
            id: _this.cache.mine.id
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              _this.cache.mine = _this.$root.$.extend(true, _this.cache.mine, data.data)
            } else {
              _this.$root.layer.msg(data.code + ' : ' + data.msg)
            }
            _this.$root.imdemo.conn.open({
              userCode: _this.cache.mine.id,
              token: _this.cache.mine.token
            })
            console.log(_this.cache.mine)
          }
        })
      }
    }
  }
</script>
<style>
</style>
