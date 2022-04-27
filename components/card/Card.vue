<template>
  <v-card
    flat
    color="grey lighten-4"
    class="ma-3"
  >
    <v-card-title class="text-body-2 font-weight-bold py-1 px-2">
      {{ card.title }}
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  }
}
</script>
