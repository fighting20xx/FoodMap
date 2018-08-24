/**
 * Created by fight on 2018/8/24.
 */


import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMode} from '@/config/env'

import routes from './root'



Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: routerMode,
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition ||0}
    }
  }
});



export default router;
