export default ({ app, $axios, isDev }) => {
  $axios.onRequest((config) => {
    if (isDev) {
      console.dir(config)
    }

    // headerにtoken付与
    app.$auth.axiosRequestInterceptor(config)
  })

  $axios.onResponse((response) => {
    if (isDev) {
      console.dir(response)
    }
  })

  $axios.onError((error) => {
    if (isDev) {
      console.dir(error)
    }

    // backendのauthミドルウェアへの対応
    app.$auth.axiosErrorInterceptor(error)
  })
}
