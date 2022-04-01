export default ({ app, redirect, store, from }) => {
  if (app.$auth.loggedIn) {
    store.dispatch('flash/setFlash', { text: app.i18n.t('flash.guestMiddleware'), color: 'red' })
    redirect({ name: 'index' })
    if (from.name === 'index') {
      store.dispatch('flash/countUpFlash')
    }
  }
}
