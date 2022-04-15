<template>
  <v-card
    flat
    width="300"
    height="100%"
    class="mr-5 mb-5"
  >
    <list-update-form :list="list" />
  </v-card>
</template>

<script>
import ListUpdateForm from '~/components/list/UpdateForm.vue'

export default {
  components: { ListUpdateForm },
  props: {
    list: {
      type: Object,
      required: true
    }
  }
}
</script>
