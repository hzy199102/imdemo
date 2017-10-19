<template>
  <div class="findFriendPanel">
    <div style="text-align: center;">
      <input type="text" placeholder="" class="find-input" v-model="searchFriendVal">
      <button class="layui-btn" @click="searchFriend">搜索</button>
    </div>
    <div class="findFriendMain">
      <findFriendItemPanel v-for="(findFriendItem,key) in searchFriendList" :findFriendItem="findFriendItem" :cache="cache"></findFriendItemPanel>
      <div v-if="searchFriendList.length === 0" style="text-align: center; line-height: 330px;">无搜索结果</div>
    </div>
    <div id="findFriendPages" style="text-align: center; display: none;"  :class="searchFriendList.length !== 0 ? 'layui-show' : ''">
    </div>
  </div>
</template>
<script>
  import findFriendItemPanel from './findFriendItemPanel.vue'
  export default {
    props: ['cache'],
    data () {
      return {
        searchFriendVal: '',
        skin: '#AF0000',
        groups: 5,
        skip: true,
        pageCount: 16,
        searchFriendList: []
      }
    },
    components: {
      findFriendItemPanel
    },
    created: function () {
      var _this = this
      console.log(_this)
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
            withCredentials: true
          },
          beforeSend: function (request) {
            request.setRequestHeader('appID', _this.$root.webim_config.appId)
          },
          success: function (data) {
            if (data.code === 1) {
              // data.data.userName = '1820108178418201081784'
              for (var i = 0; i < 15; i++) {
                _this.searchFriendList.push(data.data)
              }
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
</style>
