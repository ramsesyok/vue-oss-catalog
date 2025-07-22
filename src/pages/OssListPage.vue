<template>
  <v-container fluid>
    <OssFilterBar
      v-model:name="filters.name"
      class="mb-4"
      @search="onSearch"
    />
    <OssTable
      :items="list"
      :items-per-page="size"
      :loading="loading"
      :page="page"
      :total-items="total"
      @update:items-per-page="onItemsPerPageChange"
      @update:page="onPageChange"
    />
    <OssDetailDialog v-model:open="detailOpen" @saved="onSaved" />
    <v-btn class="fab" color="primary" icon="mdi-plus" @click="openCreate" />
    <v-snackbar v-model="snackbar" timeout="3000">{{ snackbarMessage }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { useOssStore } from '@/stores/useOssStore'
  import { useI18n } from 'vue-i18n'

  const ossStore = useOssStore()
  const { list, loading, page, size, total, filters } = storeToRefs(ossStore)
  const { fetchList } = ossStore

  const { t } = useI18n()
  const detailOpen = ref(false)
  const snackbar = ref(false)
  const snackbarMessage = ref('')

  onMounted(() => {
    fetchList()
  })

  function onSearch () {
    ossStore.page = 1
    fetchList()
  }

  function onPageChange (p: number) {
    ossStore.page = p
    fetchList()
  }

  function onItemsPerPageChange (s: number) {
    ossStore.page = 1
    ossStore.size = s
    fetchList()
  }

  function openCreate () {
    detailOpen.value = true
  }

  async function onSaved () {
    await fetchList()
    showToast(t('toast.saved'))
  }

  function showToast (msg: string) {
    snackbarMessage.value = msg
    snackbar.value = true
  }
</script>

<style scoped>
.fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
}
</style>
