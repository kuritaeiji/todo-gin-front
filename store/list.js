export const state = () => ({
  lists: []
})

export const getters = {
  lists (state) {
    return state.lists
  }
}

export const mutations = {
  setLists (state, lists) {
    state.lists = lists
  },
  createList (state, list) {
    state.lists.push(list)
  },
  updateList (state, list) {
    const index = state.lists.findIndex(l => l.id === list.id)
    state.lists.splice(index, 1, list)
  },
  destroyList (state, id) {
    state.lists = state.lists.filter(list => list.id !== id)
  }
}

export const actions = {
  async getLists ({ commit }) {
    const response = await this.$axios.$get('/lists')
    commit('setLists', response)
  },
  async createList ({ commit }, list) {
    const response = await this.$axios.$post('/lists', list)
    commit('createList', response)
  },
  async updateList ({ commit }, list) {
    const response = await this.$axios.$put(`/lists/${list.id}`, { title: list.title })
    commit('updateList', response)
  },
  async destroyList ({ commit }, id) {
    await this.$axios.$delete(`/lists/${id}`)
    commit('destroyList', id)
  }
}
