import Vue from 'vue'
import testApp from './testApp'

require('../../assets/js/config')
require('../../assets/js/jquery-1.10.2.min')
require('../../assets/js/jquery-migrate-1.2.1.min')
require('../../assets/js/excanvas')
require('../../assets/js/qrcode')
require('../../assets/layim/css/modules/layim/layim.css')
require('../../assets/layim/css/layui.css')
require('../../assets/layim/css/modules/layer/default/layer.css')
require('../../assets/layim/lay/modules/layer')
require('../../assets/js/sdk')
require('../../assets/js/index')

Vue.prototype.eventHub = Vue.prototype.eventHub || new Vue()
Vue.prototype.imdemo = Vue.prototype.imdemo || window.imdemo
Vue.prototype.$ = Vue.prototype.$ || window.$
Vue.prototype.webim_code = Vue.prototype.webim_code || window.webim_code
Vue.prototype.webim_config = Vue.prototype.webim_config || window.webim_config
Vue.prototype.layer = Vue.prototype.layer || window.layer

var test = new Vue({
  el: '#test',
  template: '<testApp/>',
  components: { testApp }
})
console.log(test)
