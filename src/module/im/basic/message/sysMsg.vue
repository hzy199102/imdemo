<template>
  <div style="margin: 0 auto;text-align: center;">
    <div class="sysMsg">
      {{ Message.content }}
    </div>
   </div>
</template>
<script>
  export default {
    props: ['Message'],
    data () {
      return {
      }
    }
  }
</script>
<style>
  .sysMsg {
    height: 26px;
    display: inline-table;
    border: 1px solid #a1a1a1;
    text-align: center;
    line-height: 26px;
    font-size: 13px;
    color: #333333;
    background-color: #dbdbdb;
    padding: 2px 20px 0px 20px;
    border-radius: 5px;
    margin: 10px;
  }
</style>
