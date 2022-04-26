<template>
  <v-textarea
    ref="title"
    v-model="setTitle"
    outlined
    autofocus
    hide-details
    validate-on-blur
    height="100"
    placeholder="カードのタイトルを入力"
    :rules="rules"
    class="font-weight-bold"
    @keyup.enter="submit"
    @keyup.esc="cancel"
  />
</template>

<script>
import { max, required } from '~/validators'

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      rules: [required, max(100)]
    }
  },
  computed: {
    setTitle: {
      get () {
        return this.title
      },
      set (val) {
        if (/^\s+$/.test(val)) {
          this.$refs.title.lazyValue = val.slice(0, -1)
          return
        }

        this.$emit('update:title', val)
      }
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
