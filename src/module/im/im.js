import Vue from 'vue'
import ImApp from './ImApp'

// require('@static/config')
require('../../assets/js/jquery-1.10.2.min')
require('../../assets/js/jquery-migrate-1.2.1.min')
require('../../assets/js/excanvas')
require('../../assets/js/qrcode')
require('../../assets/layim/css/modules/layim/layim.css')
require('../../assets/layim/css/layui.css')
require('../../assets/layim/css/modules/layer/default/layer.css')
require('../../assets/layim/lay/modules/layer')
require('../../assets/layim/css/modules/laypage/laypage.css')
require('../../assets/layim/lay/modules/laypage2')
require('../../assets/js/sdk')
require('../../assets/js/index')

Vue.prototype.eventHub = Vue.prototype.eventHub || new Vue()
Vue.prototype.imdemo = Vue.prototype.imdemo || window.imdemo
Vue.prototype.$ = Vue.prototype.$ || window.$
Vue.prototype.webim_code = Vue.prototype.webim_code || window.webim_code
Vue.prototype.webim_config = Vue.prototype.webim_config || window.webim_config
Vue.prototype.layer = Vue.prototype.layer || window.layer
Vue.prototype.laypage = Vue.prototype.laypage || window.laypage

// 本地存储
Vue.prototype.data = function (table, settings) {
  table = table || 'layui'
  // 如果settings为null，则删除表
  if (settings === null) {
    return delete localStorage[table]
  }
  settings = typeof settings === 'object' ? settings : {key: settings}
  var data
  try {
    data = JSON.parse(localStorage[table])
  } catch (e) {
    data = {}
  }
  if (settings.value) {
    data[settings.key] = settings.value
  }
  if (settings.remove) {
    delete data[settings.key]
  }
  localStorage[table] = JSON.stringify(data)
  return settings.key ? data[settings.key] : data
}

var im = new Vue({
  el: '#im',
  template: '<ImApp/>',
  components: { ImApp }
})
console.log(im)
