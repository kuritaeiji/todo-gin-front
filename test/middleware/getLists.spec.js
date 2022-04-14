import getLists from '~/middleware/getLists'

describe('middleware/getLists', () => {
  let store
  beforeEach(() => {
    store = {
      dispatch: jest.fn()
    }
  })

  it('リスト一覧を取得する', () => {
    getLists({ store })
    expect(store.dispatch).toHaveBeenCalledWith('list/getLists')
  })
})
