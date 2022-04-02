export default (ctx) => {
  // if (app.$auth.loggedIn) {
  //   store.dispatch('flash/setFlash', { text: app.i18n.t('flash.guestMiddleware'), color: 'red' })
  //   redirect({ name: 'index' })
  //   if (from.name === 'index') {
  //     store.dispatch('flash/countUpFlash')
  //   }
  // }
  ctx.app.$auth.guestMiddleware(ctx)
}
