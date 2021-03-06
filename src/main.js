// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {
  Dialog,
  Input,
  Button,
  Tooltip,
  Rate,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';
import './stytles/index.scss'
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Rate)
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
