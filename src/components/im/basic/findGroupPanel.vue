<template>
  <div class="findGroupPanel">
    <div style="text-align: center;">
      <input type="text" placeholder="" class="find-input" v-model="searchGroupVal">
      <button class="layui-btn" @click="searchGroup">搜索</button>
    </div>
    <div class="findGroupMain">
      <findGroupItemPanel v-for="(findGroupItem,key) in searchGroupList" :findGroupItem="findGroupItem" :cache="cache"></findGroupItemPanel>
      <div v-if="searchGroupList.length === 0" style="text-align: center; line-height: 330px;">无搜索结果</div>
    </div>
    <div id="findGroupPages" style="text-align: center; display: none;"  :class="searchGroupList.length !== 0 ? 'layui-show' : ''">
    </div>
  </div>
</template>
<script>
  import findGroupItemPanel from './findGroupItemPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        searchGroupVal: '',
        skin: '#AF0000',
        groups: 5,
        skip: true,
        pageCount: 16,
        searchGroupList: []
      }
    },
    components: {
      findGroupItemPanel
    },
    created: function () {
      var _this = this
      console.log(_this)
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
            withCredentials: true
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
</style>
