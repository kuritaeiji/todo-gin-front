export default ({ app, redirect, store, from }) => {
  if (!app.$auth.loggedIn) {
    store.dispatch('flash/setFlash', { text: app.i18n.t('flash.authMiddleware'), color: 'red' })
    redirect({ name: 'login' })
    if (from.name === 'login') {
      store.dispatch('flash/countUpFlash')
    }
  }
}
