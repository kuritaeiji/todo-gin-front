<template>
  <before-logged-in-form :title="title">
    <v-form>
      <user-form
        v-bind.sync="params.auth"
        @submit="login"
      />
    </v-form>

    <ui-google-btn login />

    <div class="mt-3 text-center">
      <div class="font-weight-bold">
        テストユーザー
      </div>
      メールアドレス: user@example.com<br>
      パスワード: Password1010
    </div>
  </before-logged-in-form>
</template>

<script>
import UiGoogleBtn from '~/components/ui/GoogleBtn.vue'

export default {
  components: { UiGoogleBtn },
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
