<template>
  <v-app>
    <router-view />
    <v-snackbar v-model="visible" :color="color" timeout="3000">
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
  import { useToast } from '@/composables/useToast'

  const { visible, message, color } = useToast()
</script>
