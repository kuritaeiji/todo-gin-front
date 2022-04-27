<template>
  <div>
    <v-btn
      v-show="!isShow"
      depressed
      width="300"
      color="white"
      class="primary--text font-weight-bold justify-start"
      @click="toggleIsShow"
    >
      ＋ {{ btnText }}
    </v-btn>

    <v-card
      v-show="isShow"
      flat
      width="300"
      height="100%"
    >
      <v-form ref="form" @submit.prevent>
        <list-form v-bind.sync="newList" @submit="createListTemplate" @cancel="cancelCreateList" />
        <list-card-create-btn :btn-text="btnText" @create="createListTemplate" @cancel="cancelCreateList" />
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ListForm from '~/components/list/Form.vue'
import ListCardCreateBtn from '~/components/ui/ListCardCreateBtn.vue'

export default {
  components: {
    ListForm,
    ListCardCreateBtn
  },
  data () {
    return {
      isShow: false,
      newList: {
        title: '',
        index: this.$store.getters['list/listsLength']
      },
      btnText: 'リストを追加'
    }
  },
  computed: mapGetters('list', ['listsLength']),
  watch: {
    listsLength (newLength) {
      this.newList.index = newLength
    }
  },
  methods: {
    ...mapActions('list', ['createList']),
    toggleIsShow () {
      this.isShow = !this.isShow
    },
    async createListTemplate () {
      if (!this.$refs.form.validate()) {
        return
      }

      try {
        await this.createList(this.newList)
        this.resetCreatForm()
      } catch (error) {
        this.$handler.standardAxiosError(error)
      }
    },
    cancelCreateList () {
      this.resetCreatForm()
      this.toggleIsShow()
    },
    resetCreatForm () {
      this.newList.title = ''
    }
  }
}
</script>
