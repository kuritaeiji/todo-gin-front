<template>
  <v-container fluid class="d-flex flex-wrap">
    <list-card v-for="list of lists" :key="`list-card-${list.id}`" :list="list" />

    <list-create-form />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ListCard from '~/components/list/Card.vue'
import ListCreateForm from '~/components/list/CreateForm.vue'

export default {
  components: { ListCard, ListCreateForm },
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
