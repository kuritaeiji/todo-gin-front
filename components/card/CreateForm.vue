<template>
  <div class="mx-3 mb-1">
    <v-btn
      v-show="!isShowForm"
      block
      depressed
      color="white"
      class="primary--text font-weight-bold justify-start px-0"
      @click="toggleIsShowForm"
    >
      ＋ カードを追加
    </v-btn>

    <v-form v-show="isShowForm" ref="form" @submit.prevent>
      <card-form :title.sync="title" @submit="createCardTemplate" @cancel="cancelCreateCard" />
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CardForm from '~/components/card/Form.vue'

export default {
  components: { CardForm },
  props: {
    listId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isShowForm: false,
      title: ''
    }
  },
  methods: {
    ...mapActions('card', ['createCard']),
    toggleIsShowForm () {
      this.isShowForm = !this.isShowForm
    },
    cancelCreateCard () {
      this.toggleIsShowForm()
      this._resetForm()
    },
    async createCardTemplate () {
      if (!this.$refs.form.validate()) {
        return
      }

      try {
        await this.createCard({ title: this.title, listID: this.listId })
        this._resetForm()
      } catch (error) {
        this.$handler.standardAxiosError(error)
      }
    },
    _resetForm () {
      this.title = ''
      this.$refs.form.resetValidation()
    }
  }
}
</script>
