<template>
  <div class="findGroupPanel">
    <div style="text-align: center;">
      <input type="text" placeholder="" class="find-input" v-model="searchGroupVal">
      <button class="layui-btn" @click="searchGroup">搜索</button>
    </div>
    <div class="findGroupMain">
      <div v-for="(findGroupItem,key) in searchGroupList" class="findGroupItemPanel">
        <img :src="findGroupItem.avatar">
        <div style="width: 105px;float: right">
          <div :title="findGroupItem.groupName">{{ findGroupItem.groupName }}</div>
          <div style="height: 22px"></div>
          <button class="layui-btn layui-btn-mini layui-btn-normal" @click="addGroup(findGroupItem)">
            <i class="layui-icon">&#xe608;</i> 加群
          </button>
        </div>
      </div>
      <div v-if="searchGroupList.length === 0" style="text-align: center; line-height: 330px;">无搜索结果</div>
    </div>
    <div id="findGroupPages" style="text-align: center; display: none;"  :class="searchGroupList.length !== 0 ? 'layui-show' : ''">
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import sendAddGroupPanel from './sendAddGroupPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        searchGroupVal: '',
        skin: '#AF0000',
        groups: 5,
        skip: true,
        pageCount: 16,
        searchGroupList: [],
        sendAddGroupPanelVue: null,
        layimSendAddGroup: null
      }
    },
    components: {
    },
    created: function () {
    },
    methods: {
      searchGroup: function () {
        var _this = this
        _this.searchGroupList = []
        if (_this.searchGroupVal === '') {
          _this.$root.layer.msg('请输入群名称')
          return false
        }
        _this.$root.$.ajax({
          type: 'post',
          url: _this.$root.webim_config.apiPath + 'group/findGroup',
          data: JSON.stringify({
            groupName: _this.searchGroupVal
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
            console.log(data)
            if (data.code === 1) {
              _this.searchGroupList = data.data
              _this.$root.laypage({
                cont: 'findGroupPages',
                pages: Math.ceil(_this.searchGroupList.length / _this.pageCount),
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
      addGroup: function (findGroupItem) {
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
                findGroupItem: findGroupItem,
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
  .findGroupPanel {
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
  .findGroupMain {
    height: 330px;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto
  }
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
