<template>
  <v-data-table
    item-value="id"
    :items="items"
    :items-length="totalItems"
    :items-per-page="itemsPerPage"
    :loading="loading"
    :page="page"
    @click:row="onRowClick"
    @update:items-per-page="s => emit('update:items-per-page', s)"
    @update:page="p => emit('update:page', p)"
  >
    <template #headers>
      <tr>
        <th class="text-left">Code</th>
        <th class="text-left">Name</th>
        <th class="text-left">Manager</th>
        <th class="text-left">Actions</th>
      </tr>
    </template>
    <template #item="{ item }">
      <tr>
        <td>{{ item.projectCode }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.manager }}</td>
        <td>
          <v-btn size="small" variant="text" @click.stop="emit('detail', item)">
            詳細
          </v-btn>
          <v-menu location="bottom">
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
            </template>
            <v-list density="compact">
              <v-list-item @click="emitExport(item.id, 'csv')">
                <v-list-item-title>{{ $t('export.csv') }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="emitExport(item.id, 'spdx-json')">
                <v-list-item-title>{{ $t('export.spdx') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { Project } from '@/api'

  interface Props {
    items: Project[]
    loading: boolean
    page: number
    itemsPerPage: number
    totalItems: number
  }

  defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:page' | 'update:items-per-page', value: number): void
    (e: 'row-click' | 'detail', item: Project): void
    (e: 'export', payload: { id: string, format: 'csv' | 'spdx-json' }): void
  }>()

  function onRowClick (_: unknown, row: { item: Project }) {
    emit('row-click', row.item)
  }

  function emitExport (id: string, format: 'csv' | 'spdx-json') {
    emit('export', { id, format })
  }
</script>
