<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <div>
      <div style="overflow: hidden;">
        <div class='message' :class="Message.mine ? 'mine' : '' ">
          <!--<img class="avatar" src="../../../../assets/headIcon.png">-->
          <img class="avatar" v-bind:src="Message.avatar">
          <div class="content" >
            <div class="time" v-html="content()"></div>
            <div class="bubble">
              <div class="bubble_content">
                <imageMsg v-if="Message.type === 'image'" :Message="Message"></imageMsg>
                <attachMsg v-if="Message.type === 'attach'" :Message="Message"></attachMsg>
                <textMsg v-if="Message.type === 'text'" :Message="Message"></textMsg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import textMsg from './textMsg.vue'
  import imageMsg from './imageMsg.vue'
  import attachMsg from './attachMsg.vue'
  export default {
    props: ['Message'],
    data () {
      return {
      }
    },
    methods: {
      digit: function (num) {
        return num < 10 ? '0' + (num | 0) : num
      },
      date: function (timestamp) {
        var _this = this
        var d = new Date(timestamp || new Date())
        return d.getFullYear() + '-' + _this.digit(d.getMonth() + 1) + '-' + _this.digit(d.getDate()) + ' ' + _this.digit(d.getHours()) + ':' + _this.digit(d.getMinutes()) + ':' + _this.digit(d.getSeconds())
      },
      content: function () {
        var _this = this
        var content = ''
        if (_this.Message.mine) {
          content = _this.date(_this.Message.sendTime) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + _this.Message.name
        } else {
          content = _this.Message.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + _this.date(_this.Message.sendTime)
        }
        return content
      }
    },
    components: {
      textMsg,
      imageMsg,
      attachMsg
    }
  }
</script>
<style>
  .time {
    margin-left: 10px;
    margin-bottom: 5px;
    font-size: 12px;
    color:#999999;
  }
  .mine .time {
    margin-right: 10px;
    margin-bottom: 5px;
    font-size: 12px;
    color:#999999;
  }
  .message {
    width:100%;
    margin-top:10px;
    margin-bottom:10px;
  }
  .message.mine {
    text-align: right;
    float: right;
    clear: right;
  }
  .message .avatar {
    width: 40px;
    height: 40px;
    float: left;
    cursor: pointer;
    border-radius: 20px;
  }
  .message.mine .avatar {
    float: right;
  }
  .content {
    overflow: hidden;
  }
  .bubble {
    max-width: 500px;
    min-height: 1em;
    display: inline-block;
    vertical-align: top;
    position: relative;
    text-align: left;
    font-size: 14px;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    margin: 0 10px;
    background-color: #F0F0F0;
  }
  .mine .bubble {
    background-color: #DCE7FB;
  }
  .bubble:after {
    right: 100%;
    position: absolute;
    top: 10px;
    border: 6px solid rgba(169, 23, 23, 0);
    content: "";
    border-right: 5px solid #F0F0F0;
    border-top: 5px solid #F0F0F0;
  }
  .mine .bubble:after {
    left: 100%;
    position: absolute;
    top: 10px;
    border: 6px solid rgba(169, 23, 23, 0);
    content: "";
    border-left: 5px solid #DCE7FB;
    border-top: 5px solid #DCE7FB;
  }
  .bubble_content {
    word-wrap: break-word;
    word-break: break-all;
    min-height: 25px;
  }
</style>
