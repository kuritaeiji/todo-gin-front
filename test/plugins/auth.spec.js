import { Auth } from '~/plugins/auth'
import { recordNotFoundError, passwordAuthenticationError } from '~/errors'

describe('plugins/Auth', () => {
  describe('login', () => {
    const authParams = { email: 'test@example.com', password: 'password' }

    it('$axiosに$postメソッドを送信する', () => {
      const $axios = {
        $post: jest.fn()
      }
      const auth = new Auth({ $axios, stoer: 'store', app: 'app' })
      auth.login(authParams)
      expect($axios.$post).toHaveBeenCalledWith('/login', authParams)
    })

    it('ログインに成功するとlocalstorageにBearerトークンを保存し、authstoreのloggedInステートをtrueにし、indexパスにリダイレクトする', async () => {
      const response = { token: 'token' }
      const $axios = {
        $post () { return new Promise(resolve => resolve(response)) }
      }
      const store = { dispatch: jest.fn() }
      const redirect = jest.fn()
      const auth = new Auth({ $axios, store, redirect })
      auth.storage = { setItem: jest.fn() }

      await auth.login(authParams)
      expect(auth.storage.setItem).toHaveBeenCalledWith(auth.accessTokenKey, auth.tokenType + response.token)
      expect(store.dispatch).toHaveBeenCalledWith('auth/setLoggedIn', true)
      expect(redirect).toHaveBeenCalledWith({ name: 'index' })
    })

    it('ログインが失敗し、ユーザーが見つからなかった場合バリデーションを作成する', async () => {
      const error = { response: { status: recordNotFoundError.status, data: { content: recordNotFoundError.content } } }
      const $axios = { $post () { return new Promise((resolve, reject) => reject(error)) } }
      const store = { dispatch: jest.fn() }
      const app = { i18n: { t (key) { return key } } }
      const auth = new Auth({ $axios, store, app })
      await auth.login(authParams)

      expect(store.dispatch).toHaveBeenCalledWith('validation/setValidation', `error.login.${recordNotFoundError.content}`)
    })

    it('ログインが失敗し、パスワードが間違っている場合バリデーションを作成する', async () => {
      const error = { response: { status: passwordAuthenticationError.status, data: { content: passwordAuthenticationError.content } } }
      const $axios = { $post () { return new Promise((resolve, reject) => reject(error)) } }
      const store = { dispatch: jest.fn() }
      const app = { i18n: { t (key) { return key } } }
      const auth = new Auth({ $axios, store, app })
      await auth.login(authParams)

      expect(store.dispatch).toHaveBeenCalledWith('validation/setValidation', `error.login.${passwordAuthenticationError.content}`)
    })

    it('ログインが意図しないエラーで失敗する場合$handlerにstandardAxiosErrorメソッドを送信する', async () => {
      const error = {}
      const $axios = { $post () { return new Promise((resolve, reject) => reject(error)) } }
      const app = { $handler: { standardAxiosError: jest.fn() } }
      const auth = new Auth({ $axios, store: 'store', app })
      await auth.login(authParams)

      expect(app.$handler.standardAxiosError).toHaveBeenCalledWith(error)
    })
  })

  describe('logoutメソッド', () => {
    const app = { i18n: { t: key => key } }
    let storage
    let store
    let redirect
    let vue
    beforeEach(() => {
      storage = { removeItem: jest.fn() }
      store = { dispatch: jest.fn() }
      redirect = jest.fn()
      vue = {
        $nuxt: {
          setLayout: jest.fn()
        }
      }
    })

    describe('遷移元のpathがindexでない場合', () => {
      const route = { name: 'not-index' }
      let auth
      beforeEach(() => {
        auth = new Auth({ store, app, redirect, route })
        auth.storage = storage
      })

      it('localstorageのjwtを削除', () => {
        auth.logout(vue)
        expect(auth.storage.removeItem).toHaveBeenCalledWith(auth.accessTokenKey)
      })

      it('storeのloggedInをfalseにする', () => {
        auth.logout(vue)
        expect(auth.store.dispatch).toHaveBeenNthCalledWith(1, 'auth/setLoggedIn', false)
      })

      it('flashMessageを作成する', () => {
        auth.logout(vue)
        expect(auth.store.dispatch).toHaveBeenNthCalledWith(2, 'flash/setFlash', { color: 'info', text: 'flash.logout' })
      })

      it('indexパスにリダイレクトする', () => {
        auth.logout(vue)
        expect(auth.redirect).toHaveBeenCalledWith({ name: 'index' })
      })

      it('レイアウトをtoppageにしない', () => {
        auth.logout(vue)
        expect(vue.$nuxt.setLayout).not.toHaveBeenCalled()
      })

      it('flashメッセージのtransitionカウントを+しない', () => {
        auth.logout(vue)
        expect(auth.store.dispatch).toHaveBeenCalledTimes(2)
      })
    })

    describe('遷移元のpathがindexである場合', () => {
      const route = { name: 'index' }
      let auth
      beforeEach(() => {
        auth = new Auth({ store, app, redirect, route })
        auth.storage = storage
      })

      it('レイアウトをtoppageにする', () => {
        auth.logout(vue)
        expect(vue.$nuxt.setLayout).toHaveBeenCalledWith('toppage')
      })

      it('flashメッセージのtransitionCountを+する', () => {
        auth.logout(vue)
        expect(auth.store.dispatch).toHaveBeenNthCalledWith(3, 'flash/countUpFlash')
      })

      it('indexパスにリダイレクトしない', () => {
        auth.logout(vue)
        expect(auth.redirect).not.toHaveBeenCalled()
      })
    })
  })

  describe('authMiddlewareメソッド', () => {
    let store
    let redirect
    let auth
    const app = { i18n: { t: key => key } }
    beforeEach(() => {
      store = { dispatch: jest.fn(), getters: { 'auth/loggedIn': true } }
      redirect = jest.fn()
      auth = new Auth({ store, redirect, app })
    })

    describe('ログインしている場合', () => {
      it('何もしない', () => {
        auth.authMiddleware({})
        expect(store.dispatch).not.toHaveBeenCalled()
        expect(redirect).not.toHaveBeenCalled()
      })
    })

    describe('ログインしていない場合', () => {
      beforeEach(() => {
        store.getters['auth/loggedIn'] = false
      })

      let from = { name: 'login' }

      it('フラッシュメッセージを作成する', () => {
        auth.authMiddleware({ from })
        expect(store.dispatch).toHaveBeenNthCalledWith(1, 'flash/setFlash', { text: 'flash.authMiddleware', color: 'red' })
      })

      it('ログインパスにリダイレクトする', () => {
        auth.authMiddleware({ from })
        expect(redirect).toHaveBeenCalledWith({ name: 'login' })
      })

      describe('遷移元のパスがloginパスの場合', () => {
        it('flashメッセージのtransitionCountを+する', () => {
          from = { name: 'login' }
          auth.authMiddleware({ from })
          expect(store.dispatch).toHaveBeenNthCalledWith(2, 'flash/countUpFlash')
        })
      })

      describe('遷移元のパスがloginパスでない場合', () => {
        it('flashメッセージのtransitionCountを+しない', () => {
          from = { name: 'not-login' }
          auth.authMiddleware({ from })
          expect(store.dispatch).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('guestMiddlewareメソッド', () => {
    let store
    let redirect
    let auth
    const app = { i18n: { t: key => key } }
    const from = { name: 'not-index' }
    beforeEach(() => {
      store = {
        dispatch: jest.fn(),
        getters: {
          'auth/loggedIn': true
        }
      }
      redirect = jest.fn()
      auth = new Auth({ store, redirect, app })
    })

    describe('ログインしている場合', () => {
      it('フラッシュメッセージを作成する', () => {
        auth.guestMiddleware({ from })
        expect(store.dispatch).toHaveBeenNthCalledWith(1, 'flash/setFlash', { text: 'flash.guestMiddleware', color: 'red' })
      })

      it('indexパスにリダイレクト', () => {
        auth.guestMiddleware({ from })
        expect(redirect).toHaveBeenCalledWith({ name: 'index' })
      })

      describe('遷移元がindexパスの場合', () => {
        it('flashのcountを+する', () => {
          auth.guestMiddleware({ from: { name: 'index' } })
          expect(store.dispatch).toHaveBeenNthCalledWith(2, 'flash/countUpFlash')
        })
      })

      describe('遷移元がindexパス以外の場合', () => {
        it('flashのcountを+しない', () => {
          auth.guestMiddleware({ from })
          expect(store.dispatch).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('ログインしていない場合', () => {
      it('何もしない', () => {
        store.getters['auth/loggedIn'] = false
        auth.guestMiddleware({ from })
        expect(store.dispatch).not.toHaveBeenCalled()
        expect(redirect).not.toHaveBeenCalled()
      })
    })
  })
})
