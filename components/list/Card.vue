<template>
  <v-card
    flat
    min-width="300"
    width="300"
    class="mr-5 mb-5 flex-column cursor-pointer"
    @mousedown="mouseDown"
  >
    <div class="d-flex justify-space-between">
      <list-update-form :list="list" />
      <list-destroy-btn :list="list" />
    </div>

    <div>
      <slot /> <!-- カードとカードの作成フォームが入る -->
    </div>
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
