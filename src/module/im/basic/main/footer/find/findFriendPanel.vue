<template>
  <div class="findFriendPanel">
    <div style="text-align: center;">
      <input type="text" placeholder="" class="find-input" v-model="searchFriendVal">
      <button class="layui-btn" @click="searchFriend">搜索</button>
    </div>
    <div class="findFriendMain">
      <div v-for="(findFriendItem,key) in searchFriendList" class="findFriendItemPanel">
        <img :src="findFriendItem.avatar">
        <div style="width: 105px;float: right">
          <div :title="findFriendItem.userName">{{ findFriendItem.userName }}</div>
          <div style="height: 22px"></div>
          <button class="layui-btn layui-btn-mini layui-btn-normal" @click="addFriend(findFriendItem)">
            <i class="layui-icon">&#xe608;</i> 好友
          </button>
        </div>
      </div>
      <div v-if="searchFriendList.length === 0" style="text-align: center; line-height: 330px;">无搜索结果</div>
    </div>
    <div id="findFriendPages" style="text-align: center; display: none;"  :class="searchFriendList.length !== 0 ? 'layui-show' : ''">
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import sendAddFriendPanel from './sendAddFriendPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        searchFriendVal: '',
        skin: '#AF0000',
        groups: 5,
        skip: true,
        pageCount: 16,
        searchFriendList: [],
        sendAddFriendPanelVue: null,
        layimSendAddFriend: null
      }
    },
    components: {
      sendAddFriendPanel
    },
    created: function () {
    },
    methods: {
      searchFriend: function () {
        var _this = this
        _this.searchFriendList = []
        if (_this.searchFriendVal === '') {
          _this.$root.layer.msg('请输入手机号')
          return false
        }
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'user/mobile',
          data: JSON.stringify({
            mobile: _this.searchFriendVal
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
              // data.data.userName = '1820108178418201081784'
//              for (var i = 0; i < 15; i++) {
//                _this.searchFriendList.push(data.data)
//              }
              _this.searchFriendList.push(data.data)
              _this.$root.laypage({
                cont: 'findFriendPages',
                pages: Math.ceil((_this.searchFriendList.length + 2) / _this.pageCount),
                curr: 1,
                skip: _this.skip,
                skin: _this.skin,
                groups: _this.groups,
                jump: function (obj) {
                  console.log(obj.curr)
                }
              })
            }
          }
        })
      },
      addFriend: function (findFriendItem) {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '添加好友',
          shade: false,
          area: ['460px', '360px'],
          id: 'layui-layim-sendAddFriend',
          skin: 'layui-box layui-layer-border pop-layui-layim-sendAddFriend',
          resize: false,
          content: '<div id="sendAddFriendPanelContainer"></div>',
          success: function (layero, index) {
            _this.sendAddFriendPanelVue = new Vue({
              template: '<sendAddFriendPanel :cache="cache" :findFriendItem="findFriendItem" :layimSendAddFriendIndex="layimSendAddFriendIndex"/>',
              components: { sendAddFriendPanel },
              data: {
                cache: _this.cache,
                findFriendItem: findFriendItem,
                layimSendAddFriendIndex: index
              }
            })
            _this.sendAddFriendPanelVue.$mount('#sendAddFriendPanelContainer')
            _this.layimSendAddFriend = layero
            _this.resizeChat()
          },
          end: function () {
            _this.layimSendAddFriend = null
            _this.$root.eventHub.$emit('closeSendAddFriend', {})
          }
        })
      },
      resizeChat: function () {
        var _this = this
        var findHeight = _this.layimSendAddFriend.height()
        var sendAddFriendPanel = _this.layimSendAddFriend.find('.sendAddFriendPanel')
        sendAddFriendPanel.css({
          height: findHeight - 43
//          height: findHeight - 30
        })
      }
    },
    destroyed: function () {
    }
  }
</script>
<style>
  .findFriendPanel {
  }
  .find-input {
    margin-top: 10px;
    padding-left: 10px;
    width: 600px;
    height: 38px;
    line-height: 38px;
    border: 1px solid #e6e6e6;
    background-color: #fff;
    border-radius: 2px;
  }
  .findFriendMain {
    height: 330px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto
  }
  .findFriendItemPanel {
    height: 60px;
    width: 180px;
    display: block;
    float: left;
    margin-left: 20px;
    margin-top: 20px;
  }
  .findFriendItemPanel img {
    width: 60px;
    height: 60px;
  }
  .findFriendItemPanel div {
    width: 105px;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space: nowrap;
    float: right;
  }
  .findFriendItemPanel button {
    float: left;
  }
  .findFriendItemPanel button {
    float: left;
  }
  .pop-layui-layim-sendAddFriend .layui-layer-title {
    background-color: rgb(6, 157, 213);
    /*height: 30px;*/
    /*line-height: 30px;*/
    /*color: white;*/
  }
</style>
