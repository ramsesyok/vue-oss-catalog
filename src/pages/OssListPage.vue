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
  </v-container>
</template>

<script setup lang="ts">
  import { useOssStore } from '@/stores/useOssStore'

  const ossStore = useOssStore()
  const { list, loading, page, size, total, filters } = storeToRefs(ossStore)
  const { fetchList } = ossStore

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
</script>
