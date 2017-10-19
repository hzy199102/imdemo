<template>
  <div class="mainPanel">
    <div class="layui-layim-main">
      <div class="layui-layim-info">
        <div class="layui-layim-user">{{ cache.mine.userName }}</div>
        <div class="layui-layim-status">
          <span v-if="onlineStatus === 1" class="layui-icon layim-status-online" @click="changeOnlineStatusMenu(true)">&#xe617;</span>
          <span v-if="onlineStatus === 2" class="layui-icon layim-status-hide" @click="changeOnlineStatusMenu(true)">&#xe60f;</span>
          <span v-if="onlineStatus === 3" class="layui-icon layim-status-hide" @click="changeOnlineStatusMenu(true)">&#xe60f;</span>
          <ul class="layui-anim layim-menu-box" :class="onlineStatusMenu ? 'layui-anim-upbit layui-show' : ''">
            <li :class="onlineStatus === 1 ? 'layim-this' : ''" @click="changeOnlineStatus(1)">
              <i class="layui-icon">&#xe618;</i>
              <cite class="layui-icon layim-status-online">&#xe617;</cite>
              在线
            </li>
            <li :class="onlineStatus === 2 ? 'layim-this' : ''" @click="changeOnlineStatus(2)">
              <i class="layui-icon">&#xe618;</i>
              <cite class="layui-icon layim-status-hide">&#xe60f;</cite>
              退出
            </li>
            <li v-if="$root.webim_config.debug" :class="onlineStatus === 3 ? 'layim-this' : ''" @click="changeOnlineStatus(3)">
              <i class="layui-icon">&#xe618;</i>
              <cite class="layui-icon layim-status-hide">&#xe60f;</cite>
              调试
            </li>
          </ul>
        </div>
        <div v-if="cache.base.debug" class="layui-layim-remark">{{ cache.mine.id }}</div>
      </div>
      <ul class="layui-unselect layui-layim-tab">
        <li class="layui-icon" :class="tabStatus === 3 ? 'layim-this' : ''" title="历史会话" @click="tabChange(3)">&#xe611;</li>
        <li class="layui-icon" :class="tabStatus === 1 ? 'layim-this' : ''" title="联系人" @click="tabChange(1)">&#xe612;</li>
        <li class="layui-icon" :class="tabStatus === 2 ? 'layim-this' : ''" title="群组" @click="tabChange(2)">&#xe613;</li>
      </ul>
      <ul class="layui-unselect layim-tab-content layim-list-friend" :class="tabStatus === 1 ? 'layui-show' : ''">
        <friendPanel :cache="cache" :type="1"></friendPanel>
      </ul>
      <ul class="layui-unselect layim-tab-content" :class="tabStatus === 2 ? 'layui-show' : ''">
        <groupPanel :cache="cache"></groupPanel>
      </ul>
      <ul class="layui-unselect layim-tab-content" :class="tabStatus === 3 ? 'layui-show' : ''">
        <sessionPanel :cache="cache"></sessionPanel>
      </ul>
      <ul class="layui-unselect layim-tab-content" :class="tabStatus === 4 ? 'layui-show' : ''">
        <searchPanel :cache="cache"></searchPanel>
      </ul>
      <ul class="layui-unselect layui-layim-tool">
        <li class="layui-icon layim-tool-search" @click="search" title="搜索">&#xe615;</li>
        <li class="layui-icon layim-tool-msgbox" @click="msgbox" title="消息盒子">&#xe645;<span class="layui-anim" :class="cache.msgBox.length > 0 ? 'layui-anim-loop layer-anim-05' : ''">{{ unread() }}</span></li>
        <li class="layui-icon layim-tool-find" @click="find" title="查找">&#xe608;</li>
        <li class="layui-icon layim-tool-skin" @click="skinChange" title="更换背景">&#xe61b;</li>
        <li class="layui-icon layim-tool-about" @click="about" title="关于">&#xe60b;</li>
       </ul>
       <div class="layui-layim-search" :class="tabStatus === 4 ? 'layui-show' : ''"><input v-model="searchVal"><label class="layui-icon" @click="closeSearch" >&#x1007;</label></div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import friendPanel from './content/friend/friendPanel.vue'
  import groupPanel from './content/group/groupPanel.vue'
  import sessionPanel from './content/session/sessionPanel.vue'
  import searchPanel from './content/search/searchPanel.vue'
  import skinPanel from './footer/skin/skinPanel.vue'
  import findPanel from './footer/find/findPanel.vue'
  import msgBoxPanel from './footer/msgbox/msgBoxPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        onlineStatusMenu: false,
        onlineStatus: 1,
        tabStatus: 3,
        hideTabStatus: 3,
        searchVal: '',
        skinPanelVue: null,
        findPanelVue: null,
        layimFind: null,
        msgBoxPanelVue: null,
        layimMsgBox: null
      }
    },
    components: {
      friendPanel,
      groupPanel,
      sessionPanel,
      searchPanel,
      skinPanel,
      findPanel
    },
    created: function () {
      var _this = this
      _this.$watch('searchVal', function (newVal, oldVal) {
        _this.cache.search = []
        if (newVal.trim() !== '') {
          for (var key in _this.cache.msgAll) {
            if (_this.cache.msgAll[key].basicInfo.userName.indexOf(newVal.trim()) !== -1) {
              _this.cache.search.push(_this.cache.msgAll[key].basicInfo)
            }
          }
        }
      })
      _this.$root.$(document).off('mousedown', _this.hide).on('mousedown', _this.changeOnlineStatusMenu(false))
      _this.$root.$(window).off('resize', _this.hide).on('resize', _this.changeOnlineStatusMenu(false))
    },
    methods: {
      changeOnlineStatusMenu: function (status) {
        var _this = this
        _this.onlineStatusMenu = status
      },
      changeOnlineStatus: function (status) {
        var _this = this
        _this.onlineStatusMenu = false
        _this.onlineStatus = status
        if (status === 2) {
          localStorage.removeItem('imUserID')
          localStorage.removeItem(_this.cache.mine.id)
          location.pathname = _this.$root.webim_config.publicPath + 'module/login.html'
        } else if (status === 3) {
          _this.cache.base.debug = true
        } else {
          _this.cache.base.debug = false
        }
      },
      tabChange: function (num) {
        var _this = this
        _this.tabStatus = num
        _this.hideTabStatus = num
      },
      search: function () {
        var _this = this
        _this.tabStatus = 4
      },
      closeSearch: function () {
        var _this = this
        _this.searchVal = ''
        _this.tabStatus = _this.hideTabStatus
      },
      unread: function () {
        var _this = this
        return _this.cache.msgBox.length > 999 ? '999+' : _this.cache.msgBox.length
      },
      msgbox: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '消息盒子',
          shade: false,
          area: ['600px', '520px'],
          skin: 'layui-box layui-layer-border',
          resize: false,
          content: '<div id="msgBoxPanelContainer"></div>',
          success: function (layero, index) {
            _this.msgBoxPanelVue = new Vue({
              template: '<msgBoxPanel :cache="cache"/>',
              components: { msgBoxPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.msgBoxPanelVue.$mount('#msgBoxPanelContainer')
            _this.layimMsgBox = layero
          },
          end: function () {
            _this.layimMsgBox = null
            _this.$root.eventHub.$emit('closeMsgBox', {})
          }
        })
      },
      find: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '查找',
          shade: false,
          area: ['850px', '520px'],
          id: 'layui-layim-find',
          skin: 'layui-box layui-layer-border pop-layui-layim-find',
          resize: false,
          content: '<div id="findPanelContainer"></div>',
          success: function (layero, index) {
            _this.findPanelVue = new Vue({
              template: '<findPanel :cache="cache"/>',
              components: { findPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.findPanelVue.$mount('#findPanelContainer')
            _this.layimFind = layero
            _this.resizeFind()
          },
          end: function () {
            _this.layimFind = null
            _this.$root.eventHub.$emit('closeFind', {})
          }
        })
      },
      resizeFind: function () {
        var _this = this
        var findHeight = _this.layimFind.height()
        var findFriendPanel = _this.layimFind.find('.findFriendPanel')
        var findFriendMain = _this.layimFind.find('.findFriendMain')
        var findGroupPanel = _this.layimFind.find('.findGroupPanel')
        var findGroupMain = _this.layimFind.find('.findGroupMain')
        findFriendPanel.css({
          height: findHeight - 43 - 42
        })
        findFriendMain.css({
          height: findHeight - 43 - 42 - 55 - 50
        })
        findGroupPanel.css({
          height: findHeight - 43 - 42 - 55 - 50
        })
        findGroupMain.css({
          height: findHeight - 43 - 42 - 55
        })
      },
      skinChange: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '更换背景',
          shade: false,
          area: '300px',
          skin: 'layui-box layui-layer-border',
          id: 'layui-layim-skin',
          zIndex: 66666666,
          resize: false,
          content: '<div id="skinPanelContainer"></div>',
          success: function (layero, index) {
            _this.skinPanelVue = new Vue({
              template: '<skinPanel :cache="cache"/>',
              components: { skinPanel },
              data: {
                cache: _this.cache
              }
            })
            _this.skinPanelVue.$mount('#skinPanelContainer')
          }
        })
      },
      about: function () {
        var _this = this
        _this.$root.layer.alert('版本： ' + _this.cache.version + '<br>版权所有：<a href="http://www.glodon.com/" target="_blank">glodon</a>', {
          title: '关于 云通讯',
          shade: false
        })
      }
    }
  }
</script>
<style>
  .mainPanel {
    height: 100%;
  }
  .pop-layui-layim-find .layui-layer-title {
    background-color: rgb(6, 157, 213);
  }
</style>
