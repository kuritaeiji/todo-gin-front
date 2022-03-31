<template>
  <v-container>
    <v-row justify="center" class="pt-100">
      <v-card flat width="80%" max-width="400" class="pa-5">
        <v-card-title class="justify-center font-weight-bold mb-3">
          {{ $t('page.login') }}
        </v-card-title>

        <v-form>
          <v-text-field
            v-model="auth.email"
            outlined
            type="email"
            :label="$t('model.user.email')"
          />

          <v-text-field
            v-model="auth.password"
            outlined
            :label="$t('model.user.password')"
            :type="passwordField.type"
            :append-icon="passwordField.icon"
            @click:append="togglePassword"
          />

          <v-btn
            depressed
            large
            block
            color="primary"
            class="font-weight-bold my-5"
            @click.stop="login"
          >
            {{ $t('btn.submit') }}
          </v-btn>
        </v-form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'beforeLoggedIn',
  data () {
    return {
      auth: {
        email: '',
        password: ''
      },
      isShowPassword: false
    }
  },
  computed: {
    passwordField () {
      return this.isShowPassword ? { icon: 'mdi-eye', type: 'text' } : { icon: 'mdi-eye-off', type: 'password' }
    }
  },
  methods: {
    togglePassword () {
      this.isShowPassword = !this.isShowPassword
    }
  }
}
</script>
