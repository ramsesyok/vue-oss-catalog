<template>
  <v-data-table
    item-value="id"
    :items="items"
    :items-length="totalItems"
    :items-per-page="itemsPerPage"
    :loading="loading"
    :page="page"
    @update:items-per-page="(s) => emit('update:items-per-page', s)"
    @update:page="(p) => emit('update:page', p)"
  >
    <template #headers>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Layers</th>
        <th class="text-left">Tags</th>
      </tr>
    </template>
    <template #item="{ item }">
      <tr>
        <td>{{ item.name }}</td>
        <td>{{ (item.layers || []).join(', ') }}</td>
        <td>
          <v-chip
            v-for="tag in item.tags"
            :key="tag.id"
            class="ma-1"
            size="small"
            variant="tonal"
          >{{ tag.name }}</v-chip>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { OssComponent } from '@/api'

  interface Props {
    items: OssComponent[]
    loading: boolean
    page: number
    itemsPerPage: number
    totalItems: number
  }

  defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:page' | 'update:items-per-page', value: number): void
  }>()

</script>
