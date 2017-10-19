<template>
  <div class="picture">
    <img class="msg-img" :src="src()" :bigSrc="bigSrc()" :title="this.Message.content.ImageName" @click="clickBigImage" @load="load" @error="error">
    <img class="ico_loading" :class="Message.status === 1 ? '' : 'hide'" src="../../../../assets/img/ico_loading.gif" alt="">
    <i class="ico_fail web_icon_message_fail" :class="Message.status === 2 ? '' : 'hide'" title="重新发送" @click="clickResendMsg" ></i>
  </div>
</template>
<script>
  export default {
    props: ['Message'],
    data () {
      return {
        errorPng: require('../../../../assets/img/error.png'),
        photosIndex: null,
        status: 0
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
      src: function () {
        var url = ''
        if (this.Message.content.ImageType === 5) {
          if (this.Message.content.ImageUrl === '') {
            url = this.$root.webim_config.pdUrl + '/' + this.Message.content.ImageId + '/1'
          } else {
            url = this.Message.content.ImageUrl
          }
        } else {
          if (this.Message.content.ImageUrl === '') {
            url = this.$root.webim_config.pdUrl + '/' + this.Message.content.ImageId + '/1?size=120'
          } else if (this.Message.content.ImageUrl.indexOf(this.Message.content.ImageId) > -1) {
            url = this.Message.content.ImageUrl + '?size=120'
          } else {
            var s1 = this.Message.content.ImageUrl.substring(0, this.Message.content.ImageUrl.lastIndexOf('.'))
            var s2 = this.Message.content.ImageUrl.substring(this.Message.content.ImageUrl.lastIndexOf('.'))
            url = s1 + '_120' + s2
          }
        }
        return url
      },
      bigSrc: function () {
        var url = ''
        if (this.Message.content.ImageUrl === '') {
          url = this.$root.webim_config.pdUrl + '/' + this.Message.content.ImageId + '/1'
        } else {
          url = this.Message.content.ImageUrl
        }
        return url
      },
      load: function () {
        this.$root.eventHub.$emit('loadImage', {
          groupId: this.Message.groupId
        })
      },
      error: function (event) {
        var _this = this
        var img = event.srcElement
        if (_this.status === 0) {
          _this.status = 1
          img.src = _this.bigSrc()
        } else if (_this.status === 1) {
          _this.status = 2
          img.src = _this.errorPng
        }
      },
      clickBigImage: function () {
        var _this = this
        this.$root.layer.close(_this.photosIndex)
        this.$root.layer.photos({
          photos: {
            data: [{
              alt: '大图模式',
              src: _this.bigSrc()
            }]
          },
          shade: 0.01,
          closeBtn: 2,
          anim: 0,
          resize: false,
          success: function (layero, index) {
            _this.photosIndex = index
          }
        })
      }
    }
  }
</script>
<style>
  .picture {
    padding: 9px 13px;
  }
  .msg-img {
    display: block;
    cursor: pointer;
    /*max-width: 350px;*/
    /*max-height: 240px;*/
    max-width: 120px;
  }
  .bubble_content .picture .ico_loading {
    position: absolute;
    right: 100%;
    top: 50%;
    margin-top: -7px;
    margin-right: 13px;
  }
  .bubble_content .picture .ico_fail {
    position: absolute;
    right: 100%;
    top: 50%;
    margin-top: -11px;
    margin-right: 9px;
    cursor: pointer;
  }
</style>
