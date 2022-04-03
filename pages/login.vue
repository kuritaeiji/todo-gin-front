<template>
  <before-logged-in-form :title="title">
    <v-form>
      <user-form
        v-bind.sync="params.auth"
        @submit="login"
      />
    </v-form>
  </before-logged-in-form>
</template>

<script>
export default {
  layout: 'beforeLoggedIn',
  middleware: 'guest',
  data () {
    return {
      title: this.$t('page.login'),
      params: {
        auth: {
          email: '',
          password: ''
        }
      }
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  methods: {
    login () {
      this.$auth.login(this.params.auth)
    }
  }
}
</script>
