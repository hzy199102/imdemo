<template>
  <div class='test'>
    <div>时间间隔：{{ times1 }}</div>
    <div>数据：{{ data }}</div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        enterStatus: 1,
        data: null,
        times1: null
      }
    },
    components: {
    },
    created: function () {
      var _this = this
      var startTime = null
      var endTime = null
      var url = _this.$root.webim_config.enterUrl + '?rnd=' + Math.random()
      console.log(url)
      startTime = new Date()
      console.log('开始时间' + _this.hzyDate(startTime))
      _this.$root.$.ajax({
        url: url,
        type: 'get',
        data: {
          callbackFunc: 'callback'
        },
        async: false,
        dataType: 'jsonp',
        jsonpCallback: 'callback',
        success: function (json) {
          endTime = new Date()
          _this.times1 = (endTime.getTime() - startTime.getTime()) + 'ms'
          _this.data = json
          console.log('结束时间' + _this.hzyDate(endTime))
          console.log('时间间隔' + (endTime.getTime() - startTime.getTime()) + 'ms')
          if (_this.enterStatus === 3) {
            return false
          }
          _this.enterStatus = 2
          if (typeof json === 'object') {
            for (var i = 0; i < json.length; i++) {
              if (json[i] != null) {
                if (json[i].serverType === 11) {
                  _this.$root.webim_config.xmppURL = 'ws://' + json[i].ipWAN + ':' + json[i].portWAN + '/ws'
                } else if (json[i].serverType === 9) {
                  _this.$root.webim_config.puUrl = 'http://' + json[i].ipWAN + ':' + json[i].portWAN + '/js/file'
                  _this.$root.webim_config.pdUrl = 'http://' + json[i].ipWAN + ':' + json[i].portWAN + '/file'
                  if (_this.$root.webim_config.local) {
                    _this.$root.webim_config.responseUrl = 'http://' + json[i].ipWAN + ':' + json[i].portWAN + '/response.html'
                  }
                }
              }
            }
            if (!_this.$root.webim_config.xmppURL) {
              console.log('消息服务器地址获取失败')
              return false
            }
            if (!_this.$root.webim_config.pdUrl) {
              console.log('文件服务器地址获取失败')
              return false
            }
          } else {
            console.log('入口服务信息获取失败')
          }
        }
      })
//      setTimeout(function () {
//        if (_this.enterStatus === 1) {
//          console.log('入口服务无响应')
//        }
//      }, 5000)
    },
    methods: {
      hzyDate: function (timestamp) {
        var d = new Date(timestamp || new Date())
        var digit = function (num) {
          return num < 10 ? '0' + (num | 0) : num
        }
        return d.getFullYear() + '-' + digit(d.getMonth() + 1) + '-' + digit(d.getDate()) + ' ' + digit(d.getHours()) + ':' + digit(d.getMinutes()) + ':' + digit(d.getSeconds())
      }
    }
  }
</script>
<style>
  .test {
  }
</style>
