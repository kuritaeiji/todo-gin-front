<template>
  <v-container fluid>
    <v-card
      v-for="list in lists"
      :key="`list-card-${list.id}`"
      flat
      max-width="300"
    >
      <v-card-title class="pt-1 text-body-1 font-weight-bold">
        {{ list.title }}
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout ({ app }) {
    return app.$auth.loggedIn ? 'default' : 'toppage'
  },
  middleware: ['auth', 'getLists'],
  head () {
    return {
      title: this.$t('page.index')
    }
  },
  computed: {
    ...mapGetters('list', ['lists'])
  }
}
</script>
