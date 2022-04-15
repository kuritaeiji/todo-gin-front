<template>
  <v-card
    flat
    width="300"
    height="100%"
    class="mr-5 mb-5 d-flex justify-space-between"
  >
    <list-update-form :list="list" />
    <list-destroy-btn :list="list" />
  </v-card>
</template>

<script>
import ListUpdateForm from '~/components/list/UpdateForm.vue'
import ListDestroyBtn from '~/components/list/DestroyBtn.vue'

export default {
  components: { ListUpdateForm, ListDestroyBtn },
  props: {
    list: {
      type: Object,
      required: true
    }
  }
}
</script>
