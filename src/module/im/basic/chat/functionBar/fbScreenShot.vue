<template>
  <span id='fbScreenShot_span_base64String' class="gccui-icon" title="截图">
    <input id="fbScreenShot_input_base64String" type="file" name="file" style="display: none;"></span>
</template>
<script>
  export default {
    props: ['CSInfo', 'msgAll'],
    data () {
      return {
        winIndex: -1,
        msg: '',
        action: '',
        upload: {
          check: 'image',
          maxSize: 2 * 1000 * 1000,
          maxSizeMsg: '图片过大，请上传2M以下的图片'
        }
      }
    },
    created: function () {
      var _this = this
      _this.$root.$('body').off('paste')
      _this.$root.$('body').on('paste', function (event) {
        if (typeof _this.CSInfo.gid === 'undefined') {
          console.log('还没有选择聊天对象')
          return false
        }
        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData)
        var items = clipboardData.items
        var len = items.length
        var blob = null
        event.preventDefault()
        for (var i = 0; i < len; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            blob = items[i].getAsFile()
          }
        }
        if (blob !== null) {
          var reader = new FileReader()
          reader.onload = function (event) {
            _this.uploadImgFromPaste(event.target.result)
          }
          reader.readAsDataURL(blob)
        } else {
          if (clipboardData.getData('text').indexOf('data:image/png;base64,') > -1) {
            _this.uploadImgFromPaste(clipboardData.getData('text'))
          } else {
            console.log('粘贴内容是文字')
            _this.focusInsert(_this.$root.$(':focus')[0], clipboardData.getData('text'))
            // _this.$root.eventHub.$emit('paste', clipboardData.getData('text'))
          }
        }
      })
      _this.$root.$(document).off('click', '#win_screen_shot_cancel')
      _this.$root.$(document).on('click', '#win_screen_shot_cancel', function (e) {
        console.log('取消')
        _this.$root.gccer.close(_this.winIndex)
      })
      _this.$root.$(document).off('click', '#win_screen_shot_send')
      _this.$root.$(document).on('click', '#win_screen_shot_send', function (e) {
        console.log('发送')
        _this.$root.gccer.close(_this.winIndex)
        var othis = _this.$root.$('#fbScreenShot_span_base64String')
        _this.upload.uuid = _this.$root.ironman.conn.getUniqueId()
        _this.upload.file = othis.find('input')[0]
        _this.upload.type = 'base64String'
        _this.upload.base64String = _this.msg
        _this.upload.name = '截图.png'
        _this.upload.size = -1
        _this.upload.url = _this.$root.webim_config.puUrl + '/' + _this.upload.uuid + '/3'
        _this.upload.src = _this.$root.webim_config.pdUrl + '/' + _this.upload.uuid + '/3'
        _this.upload.before = function () {
          _this.stopUpload()
        }
        _this.upload.success = function (res) {
          res.data = res.data || {}
          res.data.uuid = _this.upload.uuid
          res.data.src = _this.upload.src
          _this.recoveryUpload()
          _this.$root.eventHub.$emit('mineMessage', {
            mine: true,
            sendTime: new Date().getTime(),
            name: _this.$root.currentUser.userName,
            content: {
              ImageId: _this.upload.uuid,
              ImageName: res.data.name,
              ImageSize: res.data.size,
              ImageUrl: res.url
            },
            type: 'image',
            status: 1,
            avatar: _this.$root.currentUser.avatar,
            groupId: _this.$root.ironman.conn.generateRouteid(_this.$root.currentUser.gid, _this.CSInfo.gid)
          })
        }
        _this.upload.fail = function (res) {
          _this.recoveryUpload()
          _this.$root.gccer.msg(res.msg)
        }
        _this.$root.ironman.conn.uploadFile(_this.upload)
      })
    },
    methods: {
      focusInsert: function (obj, str) {
        if (typeof obj === 'undefined') {
          return false
        }
        var result
        var val = obj.value
        obj.focus()
        if (document.selection) {
          result = document.selection.createRange()
          document.selection.empty()
          result.text = str
        } else {
          result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)]
          obj.focus()
          obj.value = result.join('')
        }
      },
      stopUpload: function () {
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
      uploadImgFromPaste: function (msg) {
        var _this = this
        _this.msg = msg
        var downloadHtml = ['<div class="win_screen_shot_content">',
          '<div class="win_screen_shot_hd">',
          '<h3 class="title">发送图片</h3>',
          '</div>',
          '<div class="win_screen_shot_bd">',
          '<img src="' + msg + '" alt="">',
          '</div>',
          '<div class="win_screen_shot_ft">',
          '<a id="win_screen_shot_cancel" class="win_screen_shot_btn cancel" href="javascript:" ng-click="cancel()">取消</a>',
          '<a id="win_screen_shot_send" class="win_screen_shot_btn send" href="javascript:" ng-click="send()">发送</a>',
          '</div></div>'].join('')
        _this.winIndex = _this.$root.gccer.open({
          type: 1,
          area: ['450px', '420px'],
          title: false,
          closeBtn: 0,
          skin: 'win_screen_shot',
          anim: 2,
          shadeClose: true,
          content: downloadHtml
        })
      }
    }
  }
</script>
<style>
  #fbScreenShot_input_base64String {
    width: 1px !important;
    height: 1px !important;
  }
  .win_screen_shot {
    border-radius: 5px !important;
  }
  .win_screen_shot .gccui-gccer-content{
    border-radius: 5px !important;
  }
  .win_screen_shot_content {
    padding: 1em;
    background: #fff;
    color: #444;
    line-height: 1.6;
  }
  .win_screen_shot_hd .title {
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    margin-bottom: 14px;
  }
  .win_screen_shot_bd {
    height: 270px;
    padding: 15px;
  }
  .win_screen_shot_bd img{
    display: block;
    margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
  }
  .win_screen_shot_ft {
    border-top:1px solid #f1f1f1;
    overflow: hidden;
    text-align: center;
    font-size: 0;
    padding-top: 10px;
  }
  .win_screen_shot_btn {
    margin-left:16px;
    margin-top: 10px;
    color: #fff;
    border: 0 none;
    display: inline-block;
    -webkit-border-radius: 4px;
    padding: 3px 70px;
    font-size: 14px;
    background-color: #c9c9c9;
  }
  .send {
    background-color: #3caf36 !important;
  }
  .gccim-tool-screenShot {
    position: relative;
    margin: 0 10px;
    display: inline-block;
    vertical-align: top;
    font-size: 24px;
    cursor: pointer;
  }
</style>
