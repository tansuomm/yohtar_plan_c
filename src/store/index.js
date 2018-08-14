import Vuex from 'vuex'
import {login} from './../apis'
import Vue from 'vue'

Vue.use(Vuex)

// store状态编码存储
function encode (str) {
  return window.btoa(window.encodeURIComponent(str))
}

// store存储状态解码
function decode (str) {
  return window.decodeURIComponent(window.atob(str))
}

const store = new Vuex.Store({
  state: {
    token: sessionStorage.getItem('token') ? JSON.parse(decode(sessionStorage.getItem('token'))) : ''
  },
  getters: {
    token: state => state.token
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      sessionStorage.setItem('token', encode(JSON.stringify(token)))
      state.token = token
    }
  },
  actions: {
    Login ({commit}, data) {
      return new Promise((resolve, reject) => {
        login(data).then(response => {
          if (response.code === 1) {
            if (JSON.stringify(response.value) === '{}') {
              resolve(false) // 未注册
              commit('SET_TOKEN', '');
            }else{
              commit('SET_TOKEN', response.value);
              resolve(true)
            }
          } else {
            reject('验证码错误')
          }
        })
      })
    }
  }
})

export default store
