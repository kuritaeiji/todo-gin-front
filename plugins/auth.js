import { isRecordNotFoundError, isPasswordAuthenticationError } from '~/errors'

export class Auth {
  constructor ({ $axios, store, app }) {
    this.$axios = $axios
    this.store = store
    this.app = app
    this.storage = localStorage
    this.accessTokenKey = 'todoGinAccessToken'
    this.tokenType = 'Bearer '
  }

  get loggedIn () {
    return this.store.getters['auth/loggedIn']
  }

  async login (authParams) {
    try {
      const response = await this.$axios.$post('/login', authParams)
      this._loginResolve(response)
    } catch (error) {
      this._loginReject(error)
    }
  }

  hasJwt () {
    return !!this.storage.getItem(this.accessTokenKey)
  }

  _loginResolve (response) {
    this.storage.setItem(this.accessTokenKey, this.tokenType + response.token)
    this.store.dispatch('auth/setLoggedIn', true)
  }

  _loginReject (error) {
    if (isRecordNotFoundError(error.response) || isPasswordAuthenticationError(error.response)) {
      this.store.dispatch('validation/setValidation', this.app.i18n.t(`error.login.${error.response.data.content}`))
      return
    }
    this.app.$handler.standardAxiosError(error)
  }
}

export default (ctx, inject) => {
  inject('auth', new Auth(ctx))
}
