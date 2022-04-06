import { isRecordNotFoundError, isPasswordAuthenticationError, isNotLoggedInError, isNotLoggedInWithJwtIsExpiredError, isGuestError } from '~/errors'

export class Auth {
  constructor ({ $axios, store, app, redirect, route }) {
    this.$axios = $axios
    this.store = store
    this.app = app
    this.redirect = redirect
    this.route = route

    this.storage = localStorage
    this.accessTokenKey = 'todoGinAccessToken'
    this.tokenType = 'Bearer '
    this.tokenHeader = 'Authorization'
  }

  get loggedIn () {
    return this.store.getters['auth/loggedIn']
  }

  get accessToken () {
    return this.storage.getItem(this.accessTokenKey)
  }

  async login (authParams) {
    try {
      const response = await this.$axios.$post('/login', authParams)
      this._loginResolve(response)
    } catch (error) {
      this._loginReject(error)
    }
  }

  logout (vue, flashText = 'flash.logout') {
    // this.storage.removeItem(this.accessTokenKey)
    // this.store.dispatch('auth/setLoggedIn', false)
    this._coreLogout()
    this.store.dispatch('flash/setFlash', { color: 'info', text: this.app.i18n.t(flashText) })

    if (this.route.name === 'index') {
      vue.$nuxt.setLayout('toppage')
      this.store.dispatch('flash/countUpFlashBecauseNotRedirect')
      return null
    }

    this.redirect({ name: 'index' })
  }

  authMiddleware ({ from }) {
    if (!this.loggedIn) {
      this.store.dispatch('flash/setFlash', { text: this.app.i18n.t('flash.authMiddleware'), color: 'red' })
      this.redirect({ name: 'login' })
      if (from.name === 'login') {
        this.store.dispatch('flash/countUpFlashBecauseNotRedirect')
      }
    }
  }

  guestMiddleware ({ from }) {
    if (this.loggedIn) {
      this.store.dispatch('flash/setFlash', { text: this.app.i18n.t('flash.guestMiddleware'), color: 'red' })
      this.redirect({ name: 'index' })
      if (from.name === 'index') {
        this.store.dispatch('flash/countUpFlashBecauseNotRedirect')
      }
    }
  }

  axiosRequestInterceptor (config) {
    if (this.loggedIn) {
      config.headers[`${this.tokenHeader}`] = this.accessToken
    }
  }

  axiosErrorInterceptor (error) {
    // backendのauthミドルウェアの対応
    if (isNotLoggedInWithJwtIsExpiredError(error) || isNotLoggedInError(error)) {
      this._coreLogout()
      const flashText = isNotLoggedInWithJwtIsExpiredError(error) ? 'flash.notLoggedInWithJwtIsExpiredError' : 'flash.authMiddleware'
      this.store.dispatch('flash/setFlash', { color: 'red', text: this.app.i18n.t(flashText) })
      this.redirect({ name: 'login' })
    }

    // backendのguestミドルウェアの対応
    if (isGuestError(error)) {
      this.guestMiddleware({ from: this.route })
    }
  }

  hasJwt () {
    return !!this.storage.getItem(this.accessTokenKey)
  }

  // localstorageのtokenを削除し、authストアのloggedInをfalseにする -> これがログアウトの本質
  _coreLogout () {
    this.storage.removeItem(this.accessTokenKey)
    this.store.dispatch('auth/setLoggedIn', false)
  }

  _loginResolve (response) {
    this.storage.setItem(this.accessTokenKey, this.tokenType + response.token)
    this.store.dispatch('auth/setLoggedIn', true)
    this.redirect({ name: 'index' })
  }

  _loginReject (error) {
    if (isRecordNotFoundError(error) || isPasswordAuthenticationError(error)) {
      this.store.dispatch('validation/setValidation', this.app.i18n.t(`error.login.${error.response.data.content}`))
      return
    }
    this.app.$handler.standardAxiosError(error)
  }
}

export default (ctx, inject) => {
  inject('auth', new Auth(ctx))
}
