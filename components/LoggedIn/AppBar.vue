<template>
  <app-bar>
    <template #btns>
      <ui-app-bar-btn @click="logout">
        {{ $t('btn.logout') }}
      </ui-app-bar-btn>

      <ui-app-bar-btn @click="withdraw">
        {{ $t('btn.withdraw') }}
      </ui-app-bar-btn>
    </template>
  </app-bar>
</template>

<script>
export default {
  methods: {
    logout () {},
    withdraw () {}
  }
}
</script>
