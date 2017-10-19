<template>
  <span class="layui-icon layim-tool-image" title="发送文件" id='fbFile_span_file' @click="clickFile">
    &#xe61d;
    <input id="fbFile_input_file" type="file" name="file" style="display: none;">
  </span>
</template>
<script>
  export default {
    props: ['cache'],
    data () {
      return {
        upload: {
          check: 'file',
          maxSize: 20 * 1000 * 1000,
          maxSizeMsg: '文件过大，请上传20M以下的文件'
        }
      }
    },
    methods: {
      stopUpload: function (othat) {
        var _this = this
        _this.$root.$('#fbImage_span_image').attr('status', 'disabled')
        _this.$root.$('#fbImage_span_image').attr('title', '文件发送中,请稍候...')
        _this.$root.$('#fbImage_span_image').css('cursor', 'not-allowed')
        _this.$root.$('#fbFile_span_file').attr('status', 'disabled')
        _this.$root.$('#fbFile_span_file').attr('title', '文件发送中,请稍候...')
        _this.$root.$('#fbFile_span_file').css('cursor', 'not-allowed')
      },
      recoveryUpload: function () {
        var _this = this
        _this.$root.$('#fbImage_span_image').removeAttr('status')
        _this.$root.$('#fbImage_span_image').attr('title', '发送图片')
        _this.$root.$('#fbImage_span_image').css('cursor', 'pointer')
        _this.$root.$('#fbFile_span_file').removeAttr('status')
        _this.$root.$('#fbFile_span_file').attr('title', '上传文件')
        _this.$root.$('#fbFile_span_file').css('cursor', 'pointer')
      },
      clickFile: function () {
        var _this = this
        var groupId = _this.cache.currentChatInfo.groupId
        var othis = _this.$root.$('#fbFile_span_file')
        if (othis.attr('status') === 'disabled') {
          _this.$root.layer.msg('文件发送中,请稍候...')
          return false
        }
        _this.upload.uuid = _this.$root.imdemo.conn.getUniqueId()
        _this.upload.file = othis.find('input')[0]
        _this.upload.url = _this.$root.webim_config.puUrl + '/' + _this.upload.uuid + '/2'
        _this.upload.src = _this.$root.webim_config.pdUrl + '/' + _this.upload.uuid + '/2'
        _this.upload.before = function (othat) {
          _this.stopUpload(othat)
        }
        _this.upload.success = function (res) {
          res.data = res.data || {}
          res.data.uuid = _this.upload.uuid
          res.data.src = _this.upload.src
          _this.recoveryUpload()
          _this.$root.eventHub.$emit('mineMessage', {
            mine: true,
            sendTime: new Date().getTime(),
            name: _this.cache.mine.userName,
            content: {
              FileId: _this.upload.uuid,
              FileName: res.data.name,
              FileSize: res.data.size,
              FileUrl: res.url
            },
            type: 'attach',
            status: 1,
            avatar: _this.cache.mine.avatar,
            groupId: groupId
          })
        }
        _this.upload.fail = function (res) {
          _this.recoveryUpload()
          _this.$root.layer.msg(res.msg)
        }
        _this.$root.imdemo.conn.uploadFile(_this.upload)
        return _this.$root.$('#fbFile_input_file').click()
      }
    }
  }
</script>
<style>
  #fbFile_input_file {
    width: 1px !important;
    height: 1px !important;
  }
</style>
