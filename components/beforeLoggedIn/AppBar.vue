<template>
  <v-app-bar app absolute flat color="white">
    <v-app-bar-title class="font-weight-bold">
      {{ $t('appTitle') }}
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      v-for="btn in btns"
      :key="`${btn.name}-btn`"
      text
      :to="btn.to"
      class="font-weight-bold"
    >
      {{ $t(`page.${btn.name}`) }}
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  data () {
    return {
      btns: [
        { name: 'login', to: '' },
        { name: 'signup', to: '/signup' }
      ]
    }
  }
}
</script>
