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
  replaceList (state, { fromIndex, toIndex }) {
    const fromList = state.lists[fromIndex]
    const toList = state.lists[toIndex]
    state.lists.splice(fromIndex, 1, toList)
    state.lists.splice(toIndex, 1, fromList)
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
  replaceList ({ commit, getters }, { fromListID, toListID }) {
    const fromIndex = getters.listIndex(fromListID)
    const toIndex = getters.listIndex(toListID)
    commit('replaceList', { fromIndex, toIndex })
  }
}
