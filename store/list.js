export const state = () => ({
  lists: []
})

export const getters = {
  lists (state) {
    return state.lists
  },
  listsLength (state) {
    return state.lists.length
  },
  listIndex (state) {
    return (id) => {
      return state.lists.findIndex(list => list.id === id)
    }
  },
  listIndexWithDestroy (state) {
    return (id, destroyID) => {
      const lists = state.lists.filter(list => list.id !== destroyID)
      return lists.findIndex(list => list.id === id)
    }
  },
  findList (state) {
    return (id) => {
      return state.lists.find(list => list.id === id)
    }
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
  },
  addList (state, { list, index }) {
    state.lists.splice(index, 0, list)
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
  },
  async moveList ({ commit, getters }, { id, index }) {
    await this.$axios.$put(`/lists/${id}/move`, { index })
    const list = getters.findList(id)
    commit('destroyList', id)
    commit('addList', { list, index })
  }
}
