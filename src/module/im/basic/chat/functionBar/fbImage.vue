<template>
  <span class="layui-icon layim-tool-image" title="上传图片" id='fbImage_span_image' @click="clickImage">
    &#xe60d;
    <input v-bind:accept="upload.accept" id="fbImage_input_image" type="file" name="file" style="display: none;">
  </span>
  <!--<span id='fbImage_span_image' @click="clickImage" class="gccui-icon" title="上传图片">-->
    <!--<img src="../../../../assets/image.png" style="width:23px">-->
    <!--<input v-bind:accept="upload.accept" id="fbImage_input_image" type="file" name="file" style="display: none;"></span>-->
</template>
<script>
  export default {
    props: ['cache'],
    data () {
      return {
        upload: {
          accept: '.jpg,.png,.bmp,.jpeg,.JPG,.PNG,.BMP,.JPEG,.GIF,.gif',
          check: 'images',
          maxSize: 2 * 1000 * 1000,
          maxSizeMsg: '图片过大，请上传2M以下的图片',
          imageType: {
            gif: 5
          }
        }
      }
    },
    created: function () {
      var _this = this
      console.log(_this.cache)
    },
    methods: {
      stopUpload: function (othat) {
        var _this = this
        _this.$root.$('#fbImage_span_image').attr('status', 'disabled')
        _this.$root.$('#fbImage_span_image').attr('title', '图片发送中,请稍候...')
        _this.$root.$('#fbImage_span_image').css('cursor', 'not-allowed')
        _this.$root.$('#fbFile_span_file').attr('status', 'disabled')
        _this.$root.$('#fbFile_span_file').attr('title', '图片发送中,请稍候...')
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
      clickImage: function (ev) {
        var _this = this
        var groupId = _this.cache.currentChatInfo.groupId
        var othis = _this.$root.$('#fbImage_span_image')
        if (othis.attr('status') === 'disabled') {
          _this.$root.layer.msg('图片发送中,请稍候...')
          return false
        }
        _this.upload.uuid = _this.$root.imdemo.conn.getUniqueId()
        _this.upload.file = othis.find('input')[0]
        _this.upload.url = _this.$root.webim_config.puUrl + '/' + _this.upload.uuid + '/1'
        _this.upload.src = _this.$root.webim_config.pdUrl + '/' + _this.upload.uuid + '/1'
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
              ImageId: _this.upload.uuid,
              ImageName: res.data.name,
              ImageSize: res.data.size,
              ImageUrl: res.url,
              ImageType: _this.upload.imageType[res.data.type] || 1
            },
            type: 'image',
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
        return _this.$root.$('#fbImage_input_image').click()
      }
    }
  }
</script>
<style>
  #fbImage_input_image {
    width: 1px !important;
    height: 1px !important;
  }
</style>
