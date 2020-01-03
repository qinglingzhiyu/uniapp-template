import Vue from 'vue'
import { SIDEBAR_TYPE } from '@/store/mutation-types'

const app = {
  state: {
    sidebar: true,
  },
  
  mutations: {
    SET_SIDEBAR_TYPE: (state, type) => {
      state.sidebar = type
    },
  },
  
  actions: {
    setSidebar ({ commit }, type) {
      commit('SET_SIDEBAR_TYPE', type)
    },
  }
}

export default app
