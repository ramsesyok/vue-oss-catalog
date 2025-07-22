<template>
  <v-app>
    <router-view />
    <AppToast />
  </v-app>
</template>

<script lang="ts" setup>
  import AppToast from '@/components/common/AppToast.vue'
</script>
