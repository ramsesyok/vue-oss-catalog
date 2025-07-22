import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import NotFoundPage from '@/pages/NotFoundPage.vue'
import OssListPage from '@/pages/OssListPage.vue'
import ProjectListPage from '@/pages/ProjectListPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

import { RouteName } from '@/types/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.OssList,
    component: OssListPage,
    meta: { titleKey: 'oss.listTitle' },
  },
  {
    path: '/projects',
    name: RouteName.ProjectList,
    component: ProjectListPage,
    meta: { titleKey: 'project.listTitle' },
  },
  {
    path: '/settings',
    name: RouteName.Settings,
    component: SettingsPage,
    meta: { titleKey: 'settings.title' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.NotFound,
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior () {
    return { top: 0 }
  },
})

// TODO: add auth check when JWT authentication is introduced
router.beforeEach((to, from, next) => {
  next()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
