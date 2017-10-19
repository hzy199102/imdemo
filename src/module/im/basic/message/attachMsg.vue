<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="attach">
    <div class="attach_bd">
      <div class="cover">
        <!-- ngSwitchWhen: txt -->
        <!-- ngSwitchWhen: pdf -->
        <!-- ngSwitchWhen: xls -->
        <!-- ngSwitchWhen: xlsx -->
        <!-- ngSwitchWhen: doc -->
        <!-- ngSwitchWhen: docx --><i class="icon-txt"></i>
        <!-- ngSwitchWhen: ppt -->
        <!-- ngSwitchWhen: pptx -->
        <!-- ngSwitchWhen: zip -->
        <!-- ngSwitchWhen: numbers -->
        <!-- ngSwitchWhen: pages -->
        <!-- ngSwitchWhen: key -->
        <!-- ngSwitchDefault:  -->
      </div>
      <div class="cont">
        <p class="title">{{ Message.content.FileName }}</p>
        <div class="opr">
          <span>{{ size() }}</span>
          <span class="sep">|</span>
          <a v-bind:download="Message.content.FileName" target="_blank" v-bind:href="url()">下载</a>
          <!--<a target="_blank" v-bind:href="url()">下载</a>-->
          <!--<a target="_blank" @click="download" style="cursor:pointer">下载</a>-->
        </div>
      </div>
    </div>
    <img class="ico_loading" :class="Message.status === 1 ? '' : 'hide'" src="../../../../assets/img/ico_loading.gif" alt="">
    <i class="ico_fail web_icon_message_fail" :class="Message.status === 2 ? '' : 'hide'" title="重新发送" @click="clickResendMsg" ></i>
  </div>
</template>
<script>
  export default {
    props: ['Message'],
    data () {
      return {
      }
    },
    methods: {
      clickResendMsg: function () {
        var _this = this
        _this.Message.status = 3
        var msg = _this.$root.$.extend(true, {}, _this.Message)
        msg.status = 1
        msg.sendTime = new Date().getTime()
        _this.$root.eventHub.$emit('mineMessage', msg)
      },
      size: function () {
        var bytes = this.Message.content.FileSize
        if (bytes === 0) return '0 B'
        var k = 1024 // or 1000
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        var i = Math.floor(Math.log(bytes) / Math.log(k))
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
      },
      url: function () {
        var url = ''
        if (this.Message.content.FileUrl === '') {
          url = this.$root.webim_config.pdUrl + '/' + this.Message.content.FileId + '/2'
        } else {
          url = this.Message.content.FileUrl
        }
        return url
      }
//      download: function () {
//        var vm = this
//        var downloadNotify = this.$notify({
//          title: '提示',
//          message: '正在下载' + this.Message.content.FileName + ',请稍后',
//          duration: 0
//        });
//        var url = ''
//        if (this.Message.content.FileUrl === '') {
//          url = this.$root.webim_config.pdUrl + '/' + this.Message.content.FileId + '/2'
//        } else {
//          url = this.Message.content.FileUrl
//        }
//        this.$http.get(url).then((response) => {
//          // 处理正确
//          downloadNotify.close()
//          var blob = new Blob([response.body])
//          var a = document.createElement("a")
//          var evt = document.createEvent("MouseEvents")
//          evt.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
//          a.download = this.Message.content.FileName
//          a.href = URL.createObjectURL(blob)
//          a.dispatchEvent(evt)
//          this.$notify({
//            title: '成功',
//            message: '已成功下载' + this.Message.content.FileName,
//            type: 'success'
//          })
//        }, (response) => {
//          // 处理错误
//          this.$message('网络发生了错误')
//        })
//      }
    }
  }
</script>
<style>
  .bubble_content .attach {
    padding: 10px;
    background-color: #fff;
    min-height: 75px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    min-width: 250px;
    max-width: 300px;
    margin: 2px;
    position: relative;
  }
  .bubble_content .attach_bd .cover {
    display: table-cell;
    padding-right: 10px;
  }
  .icon-txt {
    display: inline-block;
    vertical-align: middle;
    width: 76px;
    height: 76px;
    background: url(../../../../assets/img/source.png) no-repeat;
    background-position: 0 -322px;
    -webkit-background-size: 487px 462px;
    background-size: 487px 462px;
  }
  .bubble_content .attach_bd .cont {
    display: table-cell;
    vertical-align: top;
  }
  .bubble_content .attach_bd .cont .title {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 200px;
    margin: 0;
  }
  .bubble_content .attach_bd .cont .opr {
    margin-top: 25px;
  }
  .bubble_content .attach_bd .cont .opr a {
    color: #35ac2f;
    text-decoration: none;
  }
  .bubble_content .attach .ico_loading {
    position: absolute;
    right: 100%;
    top: 50%;
    margin-top: -7px;
    margin-right: 13px;
  }
  .bubble_content .attach .ico_fail {
    position: absolute;
    right: 100%;
    top: 50%;
    margin-top: -11px;
    margin-right: 9px;
    cursor: pointer;
  }
</style>
