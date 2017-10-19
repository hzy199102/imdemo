<template>
  <div class="findFriendItemPanel">
    <img :src="findFriendItem.avatar">
    <div style="width: 105px;float: right">
      <div :title="findFriendItem.userName">{{ findFriendItem.userName }}</div>
      <div style="height: 22px"></div>
      <button class="layui-btn layui-btn-mini layui-btn-normal" @click="addFriend">
        <i class="layui-icon">&#xe608;</i> 好友
      </button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import sendAddFriendPanel from './sendAddFriendPanel.vue'
  export default {
    props: ['findFriendItem', 'cache'],
    data () {
      return {
        sendAddFriendPanelVue: null,
        layimSendAddFriend: null
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      addFriend: function () {
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
                findFriendItem: _this.findFriendItem,
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
