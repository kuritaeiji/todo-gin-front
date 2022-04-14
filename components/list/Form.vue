<template>
  <v-text-field
    v-model="setTitle"
    outlined
    dense
    autofocus
    hide-details
    validate-on-blur
    :rules="rules"
    class="mb-3"
    @keyup.enter="submit"
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
      rules: [required, max(50)]
    }
  },
  computed: {
    setTitle: {
      get () {
        return this.title
      },
      set (val) {
        this.$emit('update:title', val)
      }
    }
  },
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
}
</script>
