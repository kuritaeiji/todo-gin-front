<template>
  <v-card
    flat
    width="300"
    height="100%"
    class="mr-5 mb-5"
  >
    <v-card-title class="pt-1 text-body-1 font-weight-bold">
      {{ list.title }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      required: true
    }
  }
}
</script>
