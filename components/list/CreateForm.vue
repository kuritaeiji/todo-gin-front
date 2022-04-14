<template>
  <div>
    <v-btn
      v-show="!isShow"
      depressed
      width="300"
      color="white"
      class="primary--text font-weight-bold justify-start"
      @click="openForm"
    >
      ＋ リストを追加
    </v-btn>

    <v-card
      v-show="isShow"
      flat
      width="300"
      height="100%"
    >
      <v-form ref="form" @submit.prevent>
        <list-form v-bind.sync="newList" @submit="createListTemplate" />
        <v-btn
          small
          depressed
          color="primary"
          class="white--text text-body-2 font-weight-bold mr-1"
          @click="createListTemplate"
        >
          リストを追加
        </v-btn>
        <v-btn icon @click="closeForm">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ListForm from '~/components/list/Form.vue'

export default {
  components: {
    ListForm
  },
  data () {
    return {
      isShow: false,
      newList: {
        title: ''
      }
    }
  },
  methods: {
    ...mapActions('list', ['createList']),
    openForm () {
      this.isShow = true
    },
    closeForm () {
      this.isShow = false
    },
    async createListTemplate () {
      if (!this.$refs.form.validate()) {
        return
      }

      try {
        await this.createList(this.newList)
      } catch (error) {
        this.$handler.standardAxiosError(error)
      }
    }
  }
}
</script>
