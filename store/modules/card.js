import Vue from 'vue'
import { SIDEBAR_TYPE } from '@/store/mutation-types'

const card = {
  state: {
    addressDO: {},
  },
  
  mutations: {
    SET_ADDRESS: (state, type) => {
      state.addressDO = type
    },
  },
  
  actions: {
    setAddressDO ({ commit }, type) {
      commit('SET_ADDRESS', type)
    },
  }
}

export default card
