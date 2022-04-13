/* eslint-disable require-await */
import { getters, mutations, actions } from '~/store/list'

const defaultLists = [
  { id: 1, title: 'list1', index: 0, userID: 1 },
  { id: 2, title: 'list2', index: 1, userID: 2 }
]

describe('getters', () => {
  it('lists', () => {
    const result = getters.lists({ lists: defaultLists })
    expect(result).toEqual(defaultLists)
  })
})

describe('mutations', () => {
  const _state = () => ({
    lists: [...defaultLists]
  })
  let state
  beforeEach(() => {
    state = _state()
  })

  it('setLists', () => {
    const newLists = [{ id: 10 }]
    mutations.setLists(state, newLists)
    expect(state.lists).toEqual(newLists)
  })

  it('createList', () => {
    const newList = { id: 3 }
    mutations.createList(state, newList)
    expect(state.lists).toEqual([...defaultLists, newList])
  })

  it('updateList', () => {
    const updatedList = { id: 1, title: 'updating list' }
    mutations.updateList(state, updatedList)
    expect(state.lists[0]).toEqual(updatedList)
  })

  it('destroyList', () => {
    const id = 1
    mutations.destroyList(state, id)
    expect(state.lists.length).toEqual(1)
    expect(state.lists[0].id).not.toEqual(id)
  })
})

describe('actions', () => {
  let commit
  beforeEach(() => {
    commit = jest.fn()
  })
  const axiosMock = {
    $get: jest.fn(),
    $post: jest.fn(),
    $put: jest.fn(),
    $delete: jest.fn()
  }
  const axiosStub = {
    async $get () { return defaultLists },
    async $post () { return defaultLists[0] },
    async $put () { return defaultLists[0] },
    async $delete () { return null }
  }

  describe('getLists', () => {
    it('apiと通信してリスト一覧を取得する', () => {
      actions.$axios = axiosMock
      actions.getLists({ commit })
      expect(axiosMock.$get).toHaveBeenCalledWith('/lists')
    })

    it('commitする', async () => {
      actions.$axios = axiosStub
      await actions.getLists({ commit })
      expect(commit).toHaveBeenCalledWith('setLists', defaultLists)
    })
  })

  describe('createList', () => {
    it('apiと通信してリストを作成する', () => {
      actions.$axios = axiosMock
      actions.createList({ commit }, defaultLists[0])
      expect(axiosMock.$post).toHaveBeenCalledWith('/lists', defaultLists[0])
    })

    it('commitする', async () => {
      actions.$axios = axiosStub
      await actions.createList({ commit }, defaultLists[0])
      expect(commit).toHaveBeenCalledWith('createList', defaultLists[0])
    })
  })

  describe('updateList', () => {
    it('apiと通信してリストを更新する', () => {
      actions.$axios = axiosMock
      actions.updateList({ commit }, defaultLists[0])
      expect(axiosMock.$put).toHaveBeenCalledWith(`/lists/${defaultLists[0].id}`, { title: defaultLists[0].title })
    })

    it('commitする', async () => {
      actions.$axios = axiosStub
      await actions.destroyList({ commit }, defaultLists[0])
      expect(commit).toHaveBeenCalledWith('destroyList', defaultLists[0])
    })
  })

  describe('destroyList', () => {
    it('apiと通信してリストを削除する', () => {
      const id = 1
      actions.$axios = axiosMock
      actions.destroyList({ commit }, id)
      expect(axiosMock.$delete).toHaveBeenCalledWith(`/lists/${id}`)
    })

    it('commitする', async () => {
      const id = 1
      actions.$axios = axiosStub
      await actions.destroyList({ commit }, id)
      expect(commit).toHaveBeenCalledWith('destroyList', id)
    })
  })
})
