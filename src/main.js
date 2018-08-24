import Vue from 'vue'
import router from '@/router/index'
import store from './store/'

import './config/rem'
import FastClick from 'fastclick'
import App from './App.vue'
import iview from 'iview';


Vue.use(iview);




if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

const vm = new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app');


