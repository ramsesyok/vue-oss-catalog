import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const color = ref<'success' | 'error'>('success')

export function useToast () {
  function success (msg: string) {
    message.value = msg
    color.value = 'success'
    visible.value = true
  }

  function error (msg: string) {
    message.value = msg
    color.value = 'error'
    visible.value = true
  }

  return { visible, message, color, success, error }
}
