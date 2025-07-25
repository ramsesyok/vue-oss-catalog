import { createI18n } from 'vue-i18n'
import ja from '@/locales/ja.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'ja',
  messages: { ja },
})
