<template>
  <div class="findGroupItemPanel">
    <img :src="findGroupItem.avatar">
    <div style="width: 105px;float: right">
      <div :title="findGroupItem.groupName">{{ findGroupItem.groupName }}</div>
      <div style="height: 22px"></div>
      <button class="layui-btn layui-btn-mini layui-btn-normal" @click="addGroup">
        <i class="layui-icon">&#xe608;</i> 加群
      </button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import sendAddGroupPanel from './sendAddGroupPanel.vue'
  export default {
    props: ['findGroupItem', 'cache'],
    data () {
      return {
        sendAddGroupPanelVue: null,
        layimSendAddGroup: null
      }
    },
    components: {
    },
    created: function () {
      console.log(this.findGroupItem)
    },
    methods: {
      addGroup: function () {
        var _this = this
        _this.$root.layer.open({
          type: 1,
          title: '添加好友',
          shade: false,
          area: ['460px', '360px'],
          id: 'layui-layim-sendAddGroup',
          skin: 'layui-box layui-layer-border pop-layui-layim-sendAddGroup',
          resize: false,
          content: '<div id="sendAddGroupPanelContainer"></div>',
          success: function (layero, index) {
            _this.sendAddGroupPanelVue = new Vue({
              template: '<sendAddGroupPanel :cache="cache" :findGroupItem="findGroupItem" :layimSendAddGroupIndex="layimSendAddGroupIndex"/>',
              components: { sendAddGroupPanel },
              data: {
                cache: _this.cache,
                findGroupItem: _this.findGroupItem,
                layimSendAddGroupIndex: index
              }
            })
            _this.sendAddGroupPanelVue.$mount('#sendAddGroupPanelContainer')
            _this.layimSendAddGroup = layero
            _this.resizeChat()
          },
          end: function () {
            _this.layimSendAddGroup = null
            _this.$root.eventHub.$emit('closeSendAddGroup', {})
          }
        })
      },
      resizeChat: function () {
        var _this = this
        var findHeight = _this.layimSendAddGroup.height()
        var sendAddGroupPanel = _this.layimSendAddGroup.find('.sendAddGroupPanel')
        sendAddGroupPanel.css({
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
  .findGroupItemPanel {
    height: 60px;
    width: 180px;
    display: block;
    float: left;
    margin-left: 20px;
    margin-top: 20px;
  }
  .findGroupItemPanel img {
    width: 60px;
    height: 60px;
  }
  .findGroupItemPanel div {
    width: 105px;
    overflow: hidden;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    white-space: nowrap;
    float: right;
  }
  .findGroupItemPanel button {
    float: left;
  }
  .findGroupItemPanel button {
    float: left;
  }
  .pop-layui-layim-sendAddGroup .layui-layer-title {
    background-color: rgb(6, 157, 213);
    /*height: 30px;*/
    /*line-height: 30px;*/
    /*color: white;*/
  }
</style>
