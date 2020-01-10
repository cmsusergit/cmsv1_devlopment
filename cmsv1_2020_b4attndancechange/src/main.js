// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import axios from 'axios'
import config from '@/../static/test1.json'
import {store } from './store/store.js'
import 'buefy/dist/buefy.css'
import userMxn from '@/mixin/user'
import Chart from 'vue2-frappe'

Vue.config.productionTip = false
Vue.use(Chart)
Vue.use(Buefy,
{ defaultIconPack: 'fas'})
/**/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  data(){
    return{
      get apiObject(){
        return axios.create({
          baseURL:config.db_configuration.baseURL
      })
    }}
  },
  components: { App },
  template: '<App/>'
})
