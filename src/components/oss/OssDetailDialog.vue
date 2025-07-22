<template>
  <v-dialog v-model="modelOpen" max-width="600">
    <v-card>
      <v-card-title>{{ isNew ? 'Create OSS' : 'Edit OSS' }}</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-text-field v-model="form.name" label="Name" required />
          <v-text-field v-model="form.homepageUrl" label="Homepage URL" />
          <v-text-field v-model="form.repositoryUrl" label="Repository URL" />
          <v-textarea v-model="form.description" label="Description" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :loading="saving" @click="onSave">Save</v-btn>
        <v-btn text @click="close">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { OssComponentCreateRequest, OssComponentUpdateRequest } from '@/api'
  import { computed, reactive, ref, watch } from 'vue'
  import { OssService } from '@/api'

  interface Props {
    open: boolean
    ossId?: string
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'saved'): void
  }>()

  const modelOpen = computed({
    get: () => props.open,
    set: (val: boolean) => emit('update:open', val),
  })

  const isNew = computed(() => !props.ossId)

  const form = reactive<OssComponentCreateRequest>({
    name: '',
    homepageUrl: undefined,
    repositoryUrl: undefined,
    description: undefined,
  })

  const formRef = ref()
  const saving = ref(false)

  watch(
    () => props.open,
    val => {
      if (val) {
        loadDetail()
      }
    },
  )

  watch(
    () => props.ossId,
    () => {
      if (props.open) {
        loadDetail()
      }
    },
  )

  async function loadDetail () {
    if (!props.ossId) {
      resetForm()
      return
    }
    try {
      const detail = await OssService.getOssComponent({ ossId: props.ossId })
      form.name = detail.name
      form.homepageUrl = detail.homepageUrl ?? undefined
      form.repositoryUrl = detail.repositoryUrl ?? undefined
      form.description = detail.description ?? undefined
    } catch (error) {
      console.error(error)
    }
  }

  function resetForm () {
    form.name = ''
    form.homepageUrl = undefined
    form.repositoryUrl = undefined
    form.description = undefined
  }

  function close () {
    emit('update:open', false)
  }

  async function onSave () {
    saving.value = true
    try {
      if (isNew.value) {
        const payload: OssComponentCreateRequest = { ...form }
        await OssService.createOssComponent({ requestBody: payload })
      } else if (props.ossId) {
        const payload: OssComponentUpdateRequest = {
          name: form.name,
          homepageUrl: form.homepageUrl,
          repositoryUrl: form.repositoryUrl,
          description: form.description,
        }
        await OssService.updateOssComponent({ ossId: props.ossId, requestBody: payload })
      }
      emit('saved')
      close()
    } catch (error) {
      console.error(error)
    } finally {
      saving.value = false
    }
  }
</script>
