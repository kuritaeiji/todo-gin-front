<template>
  <div />
</template>

<script>
export default {
  layout ({ app }) {
    return app.$auth.loggedIn ? 'default' : 'toppage'
  },
  head () {
    return {
      title: this.$t('page.index')
    }
  }
}
</script>
