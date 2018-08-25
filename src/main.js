import Vue from 'vue'
import iView from 'iview';
import router from '@/router/index'
import store from './store/'

import './config/rem'
import FastClick from 'fastclick'
import App from './App.vue'
import Ajax from '@/dim/ajax';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(Ajax);




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


