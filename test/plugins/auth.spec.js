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

    it('ログインに成功するとlocalstorageにBearerトークンを保存し、authstoreのloggedInステートをtrueにする', async () => {
      const response = { token: 'token' }
      const $axios = {
        $post () { return new Promise(resolve => resolve(response)) }
      }
      const store = { dispatch: jest.fn() }
      const auth = new Auth({ $axios, store, app: 'app' })
      auth.storage = { setItem: jest.fn() }

      await auth.login(authParams)
      expect(auth.storage.setItem).toHaveBeenCalledWith(auth.accessTokenKey, auth.tokenType + response.token)
      expect(store.dispatch).toHaveBeenCalledWith('auth/setLoggedIn', true)
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
})
