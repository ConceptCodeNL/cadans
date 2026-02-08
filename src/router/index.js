import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false, hideForAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false, hideForAuth: true }
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: () => import('@/views/sessions/SessionsListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/session/:id',
      name: 'session-detail',
      component: () => import('@/views/sessions/SessionDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/session/:sessionId/meeting/:meetingId',
      name: 'meeting-grade',
      component: () => import('@/views/meetings/MeetingGradeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/legal/PrivacyView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/legal/TermsView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/cookies',
      name: 'cookies',
      component: () => import('@/views/legal/CookiesView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/m/s/:token',
      name: 'public-student-meeting',
      component: () => import('@/views/meetings/PublicMeetingView.vue'),
      meta: { requiresAuth: false, isPublic: true }
    },
    {
      path: '/m/r/:token',
      name: 'public-reviewer-meeting',
      component: () => import('@/views/meetings/PublicMeetingView.vue'),
      meta: { requiresAuth: false, isPublic: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.hideForAuth && authStore.user) {
    next({ name: 'sessions' })
  } else {
    next()
  }
})

export default router
