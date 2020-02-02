import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import card from './modules/card'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		card,
	},
	getters
})
