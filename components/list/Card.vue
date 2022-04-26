<template>
  <v-card
    flat
    min-width="300"
    width="300"
    class="mr-5 mb-5"
    @mousedown="mouseDown"
  >
    <div class="d-flex justify-space-between width-300">
      <list-update-form :list="list" />
      <list-destroy-btn :list="list" />
    </div>

    <slot /> <!-- リストが所有しているカード + カード追加フォームが入る -->
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
  },
  data () {
    return {
      listCard: null,
      headerHeight: 0
    }
  },
  methods: {
    mouseDown (event) {
      this.$emit('mousedown', event, this.list)
    }
  }
}
</script>
