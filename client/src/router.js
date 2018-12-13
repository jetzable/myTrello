import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import Boards from './views/Boards.vue'

import store from './store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to, from, next) {
        store.dispatch('auth/authenticate')
          .then(() => {
            console.log("Yay");
            next("/boards");
          })
          .catch(e => {
            console.error("Authentication error", e);
            next('/login');
          });
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/boards',
      name: 'boards',
      component: Boards,
      beforeEnter(to, from, next) {
        store.dispatch('auth/authenticate')
          .then(() => {
            console.log("Yay");
            next();
          })
          .catch(e => {
            console.error("Authentication error", e);
            next('/login');
          });
      }
    }
  ]
})