<template>
  <div class="createGroupPanel">
    <div v-if="type === 1" style="display: none; padding: 50px 0px" :class="step === 1 ? 'layui-show' : ''">
      <div class="layui-form-item">
        <label class="layui-form-label">群名称：</label>
        <div class="layui-input-block">
          <input v-model="groupName" type="text" name="title" placeholder="请输入群名称" autocomplete="off" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">群规模：</label>
        <div class="layui-input-block">
          <div class="layui-unselect layui-form-radio" :class="cache.capacity === 200 ? 'layui-form-radioed' : ''">
            <i class="layui-anim layui-icon" :class="cache.capacity === 200 ? 'layui-anim-scaleSpring' : ''" @click="capacityClick(200)" v-html="capacityIcon(200)"></i>
            <span>200人</span>
          </div>
          <div class="layui-unselect layui-form-radio" :class="cache.capacity === 500 ? 'layui-form-radioed' : ''">
            <i class="layui-anim layui-icon" :class="cache.capacity === 200 ? 'layui-anim-scaleSpring' : ''" @click="capacityClick(500)" v-html="capacityIcon(500)"></i>
            <span>500人</span>
          </div>
          <div class="layui-unselect layui-form-radio" :class="cache.capacity === 1000 ? 'layui-form-radioed' : ''">
            <i class="layui-anim layui-icon" :class="cache.capacity === 1000 ? 'layui-anim-scaleSpring' : ''" @click="capacityClick(1000)" v-html="capacityIcon(1000)"></i>
            <span>1000人</span>
          </div>
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">加群验证：</label>
        <div class="layui-input-block">
          <div class="layui-unselect layui-form-radio" :class="isAudit === 0 ? 'layui-form-radioed' : ''">
            <i class="layui-anim layui-icon" :class="isAudit === 0 ? 'layui-anim-scaleSpring' : ''" @click="isAuditClick(0)" v-html="isAuditIcon(0)"></i>
            <span>允许任何人</span>
          </div>
          <div class="layui-unselect layui-form-radio" :class="isAudit === 1 ? 'layui-form-radioed' : ''">
            <i class="layui-anim layui-icon" :class="isAudit === 1 ? 'layui-anim-scaleSpring' : ''" @click="isAuditClick(1)" v-html="isAuditIcon(1)"></i>
            <span>需身份验证</span>
          </div>
        </div>
      </div>
      <div class="layui-form-item layui-form-text">
        <label class="layui-form-label">群简介：</label>
        <div class="layui-input-block">
          <textarea v-model="desc" name="desc" placeholder="请输入群简介" class="layui-textarea" style="resize: none;"></textarea>
        </div>
      </div>
    </div>
    <div style="display: none;" :class="step === 2 || type === 2 ? 'layui-show' : ''">
      <div style="width: 210px; height:367px; float: left; border-right: 1px solid grey;">
        <div class="layui-layim-search layui-show" style="top: 5px"><input v-model="searchVal" style="width:165px;"><label class="layui-icon" @click="closeSearch" >&#x1007;</label></div>
        <ul class="layui-unselect layim-tab-content layim-list-friend" :class="tabStatus === 1 ? 'layui-show' : ''" style="height: 310px; margin-top: 37px;">
          <friendPanel :cache="cache" :type="2"></friendPanel>
        </ul>
        <ul class="layui-unselect layim-tab-content" :class="tabStatus === 4 ? 'layui-show' : ''" style="height: 310px; margin-top: 37px;">
          <li>
            <ul class="layui-layim-list layui-show">
              <inviteFriendPanel v-for="(inviteFriendItem,key) in cache.search" :inviteFriendItem="inviteFriendItem" :cache="cache" :type="2"></inviteFriendPanel>
              <li v-if="cache.search.length === 0" class="layim-null">无搜索结果</li>
            </ul>
          </li>
        </ul>
      </div>
      <div style="width: 210px; height:367px; float: right; border-left: 1px solid grey;">
        <div class="layui-show" style="position: absolute; width: 210px; height: 28px; line-height: 28px;top: 5px">
          <div style="float: left; margin-left: 5px;">已选成员:</div>
          <div style="float: right; margin-right: 5px;">{{ tips() }}</div>
        </div>
        <ul class="layui-unselect layim-tab-content layui-show" style="height: 310px; margin-top: 37px;">
          <li>
            <ul class="layui-layim-list layui-show">
              <li v-for="(groupMembersItem,key) in groupMembers" style="height: 20px; background-color: #aadbfe;">
                <img :src="groupMembersItem.avatar" style="width: 20px; height: 20px;">
                <span style="margin-left: -15px;">{{ userName(groupMembersItem) }}</span>
              </li>
              <inviteFriendPanel v-for="(inviteFriendItem,key) in cache.inviteFriend" :inviteFriendItem="inviteFriendItem" :cache="cache" :type="4"></inviteFriendPanel>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div style="height:30px; width: 550px; bottom: 0px; position: absolute; border-top: 1px solid grey;">
      <button v-if="type === 1" :class="step === 1 ? 'layui-show' : ''" class="layui-btn layui-btn-mini layui-btn-normal" style="display: none; bottom: 3px; position: fixed; right: 10px;" @click="next">下一步</button>
      <button v-if="type === 1" :class="step === 2 ? 'layui-show' : ''" class="layui-btn layui-btn-mini layui-btn-normal" style="display: none; bottom: 3px; position: fixed; right: 10px;" @click="finish">完成</button>
      <button v-if="type === 1" :class="step === 2 ? 'layui-show' : ''" class="layui-btn layui-btn-mini layui-btn-normal" style="display: none; bottom: 3px; position: fixed; right: 50px;" @click="prev">上一步</button>
      <button v-if="type === 2" class="layui-btn layui-btn-mini layui-btn-normal layui-show" style="display: none; bottom: 3px; position: fixed; right: 10px;" @click="finish2">完成</button>
    </div>
  </div>
</template>
<script>
  import friendPanel from '../friend/friendPanel.vue'
  import inviteFriendPanel from '../friend/inviteFriendPanel.vue'
  export default {
    props: ['cache', 'createGroupIndex', 'type', 'groupId'],
    data () {
      return {
        step: 1,
        tabStatus: 1,
        searchVal: '',
        groupName: '',
        isAudit: 1,
        desc: '',
        groupMembers: []
      }
    },
    components: {
      friendPanel,
      inviteFriendPanel
    },
    created: function () {
      var _this = this
      if (_this.type === 1) {
        _this.groupMembers.push(_this.cache.mine)
      } else if (_this.type === 2) {
        _this.groupMembers = _this.cache.msgAll[_this.groupId].basicInfo.members
        _this.cache.capacity = _this.cache.capacity - _this.groupMembers.length
      }
      _this.eventHub.$on('closeCreateGroup', function (msg) {
        _this.$destroy()
      })
      _this.$watch('searchVal', function (newVal, oldVal) {
        _this.cache.search = []
        if (newVal.trim() === '') {
          _this.tabStatus = 1
        } else {
          _this.tabStatus = 4
          for (var key in _this.cache.msgAll) {
            if (_this.cache.msgAll[key].groupType === 1 && _this.cache.msgAll[key].basicInfo.userName.indexOf(newVal.trim()) !== -1) {
              _this.cache.search.push(_this.cache.msgAll[key].basicInfo)
            }
          }
        }
      })
    },
    methods: {
      userName: function (groupMembersItem) {
        var _this = this
        var name = ''
        if (groupMembersItem.imUserID === _this.cache.mine.id) {
          name = groupMembersItem.userName + '(群主)'
        } else {
          name = groupMembersItem.userName
        }
        return name
      },
      capacityIcon: function (label) {
        var _this = this
        return _this.cache.capacity === label ? '&#xe643;' : '&#xe63f;'
      },
      capacityClick: function (label) {
        var _this = this
        _this.cache.capacity = label
        if ((_this.cache.inviteFriend.length + 1) > _this.cache.capacity) {
          _this.cache.inviteFriend = []
        }
      },
      isAuditIcon: function (label) {
        var _this = this
        return _this.isAudit === label ? '&#xe643;' : '&#xe63f;'
      },
      isAuditClick: function (label) {
        var _this = this
        _this.isAudit = label
      },
      closeSearch: function () {
        var _this = this
        _this.searchVal = ''
      },
      tips: function () {
        var _this = this
        return (_this.cache.inviteFriend.length + 1) + '/' + _this.cache.capacity
      },
      next: function () {
        var _this = this
        if (_this.groupName.trim() === '') {
          _this.$root.layer.msg('请输入群名称')
          return false
        }
        _this.step = 2
      },
      prev: function () {
        var _this = this
        _this.step = 1
      },
      finish: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'group/addGroup',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            groupName: _this.groupName,
            desc: _this.desc,
            isAudit: _this.isAudit,
            capacity: _this.cache.capacity,
            members: _this.cache.inviteFriend
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            // withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              _this.$root.layer.msg('群组创建成功')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
          }
        })
        _this.$root.layer.close(_this.layimSendAddFriendIndex)
        _this.$destroy()
      },
      finish2: function () {
        var _this = this
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'group/inviteGroup',
          data: JSON.stringify({
            uid: _this.cache.mine.id,
            groupImID: _this.groupId,
            members: _this.cache.inviteFriend
          }),
          contentType: 'application/json',
          dataType: 'json',
          async: false,
          xhrFields: {
            // withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              console.log(data)
              _this.$root.layer.msg('群员已经邀请')
            } else {
              _this.$root.layer.msg(data.code + ':' + data.msg)
            }
          }
        })
        _this.$root.layer.close(_this.layimSendAddFriendIndex)
        _this.$destroy()
      }
    },
    destroyed: function () {
      var _this = this
      _this.cache.inviteFriend = []
      _this.cache.search = []
      _this.cache.capacity = 200
      _this.$root.layer.close(_this.createGroupIndex)
    }
  }
</script>
<style>
  .createGroupPanel {
  }
  .createGroupPanel .layui-form-item {
    padding-right: 100px;
    padding-left: 50px;
  }
</style>
