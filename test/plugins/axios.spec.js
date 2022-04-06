import axiosPlugin from '~/plugins/axios'

describe('plugins/axios', () => {
  const config = 'config'
  const response = 'response'
  const error = 'error'
  const $axios = {
    onRequest: (callback) => { callback(config) },
    onResponse: (callback) => { callback(response) },
    onError: (callback) => { callback(error) }
  }

  let app
  beforeEach(() => {
    app = {
      $auth: {
        axiosRequestInterceptor: jest.fn(),
        axiosErrorInterceptor: jest.fn()
      }
    }
  })

  it('axiosのリクエスト時に、headerにjwtを追加するようauthプラグインに処理を移譲する', () => {
    axiosPlugin({ app, $axios })
    expect(app.$auth.axiosRequestInterceptor).toHaveBeenCalledWith(config)
  })

  it('axiosのエラー発生時に、backendのauthミドルウェアのエラー処理をするようauthプラグインに処理を移譲する', () => {
    axiosPlugin({ app, $axios })
    expect(app.$auth.axiosErrorInterceptor).toHaveBeenCalledWith(error)
  })
})
