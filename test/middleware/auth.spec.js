import authMiddleware from '~/middleware/auth'

describe('middleware/auth', () => {
  let dispatchMock
  let redirectMock
  let store
  let redirect
  beforeEach(() => {
    dispatchMock = jest.fn()
    redirectMock = jest.fn()
    store = { dispatch: dispatchMock }
    redirect = redirectMock
  })
  const app = { i18n: { t: key => key }, $auth: { loggedIn: true } }
  const from = { name: 'login' }

  describe('ログインしている場合何もしない', () => {
    it('何もしない', () => {
      app.$auth.loggedIn = true
      authMiddleware({ app, redirect, store, from })
      expect(dispatchMock).not.toHaveBeenCalled()
      expect(redirectMock).not.toHaveBeenCalled()
    })
  })

  describe('ログインしていない場合', () => {
    it('フラッシュメッセージを作成する', () => {
      app.$auth.loggedIn = false
      authMiddleware({ app, redirect, store, from })
      expect(dispatchMock).toHaveBeenNthCalledWith(1, 'flash/setFlash', { text: 'flash.authMiddleware', color: 'red' })
    })

    it('ログインパスにリダイレクトする', () => {
      authMiddleware({ app, redirect, store, from })
      expect(redirectMock).toHaveBeenCalledWith({ name: 'login' })
    })

    it('遷移前の画面がloginパスであった場合、遷移カウントが+されない為flashメッセージの遷移カウントを+する', () => {
      authMiddleware({ app, redirect, store, from })
      expect(dispatchMock).toHaveBeenNthCalledWith(2, 'flash/countUpFlash')
    })

    it('遷移前の画面がloginパスでない場合、flashメッセージの遷移カウントを+しない', () => {
      from.name = 'index'
      authMiddleware({ app, redirect, store, from })
      expect(dispatchMock).toHaveBeenCalledTimes(1)
    })
  })
})
