import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Login from '../views/login/Login.vue'
import ResetRequest from '../views/login/ResetPassword.vue'
import ResetPasswordAccepted from '../views/login/ResetPasswordAccepted.vue'
import DashboardAdmin from '../views/admin/AdminView.vue'
import FormAdmin from '../views/admin/FormData.vue'
import LihatDataAdmin from '../views/admin/LihatData.vue'
import SuperAdminView from '@/views/superadmin/SuperAdminView.vue'
import RiwayatView from '@/views/superadmin/RiwayatView.vue'
import RiwayatEditView from '@/views/superadmin/RiwayatEditView.vue'
import Staff from '@/views/superadmin/StaffView.vue'
import FormDataView from '@/views/superadmin/FormDataView.vue'
import StaffAddEditView from '@/views/superadmin/StaffAddEditView.vue'
import RekapDataView from '@/views/superadmin/RekapDataView.vue'
import RiwayatPreviewView from '@/views/superadmin/RiwayatPreviewView.vue'
import NotFound from '@/views/login/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Guest Routes
    {
      path: '/',
      component: Login,
    },
    {
      path: '/login', // ✅ Tambahkan route login
      component: Login,
      name: 'Login',
    },
    {
      path: '/logout',
      name: 'Logout',
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore()

        try {
          // Panggil API logout jika user masih authenticated
          if (authStore.isAuthenticated) {
            await authStore.logout() // ✅ Method ini sudah ada dan memanggil logoutUser()
          }
        } catch (error) {
          console.error('Logout error:', error)
        }

        // Redirect ke login setelah logout
        next('/login')
      },
    },
    {
      path: '/resetpassword',
      component: ResetRequest,
      name: 'ResetRequest',
    },
    {
      path: '/resetpassword-accepted',
      component: ResetPasswordAccepted,
      name: 'ResetPasswordAccepted',
      beforeEnter: (to, from, next) => {
        const namapengguna =
          to.params.namapengguna ||
          to.query.namapengguna ||
          to.query.nama_pengguna

        if (!namapengguna) {
          import('@/stores/resetStore').then(({ useResetPasswordStore }) => {
            const resetStore = useResetPasswordStore()

            if (!resetStore.requestedUsername) {
              next({
                path: '/resetpassword',
              })
            } else {
              next()
            }
          })
        } else {
          next()
        }
      },
    },

    // Admin Routes - ✅ TAMBAHKAN META
    {
      path: '/admin/dashboard',
      component: DashboardAdmin,
      name: 'Dashboard',
      meta: { requiresAuth: true, role: 'admin' }, // ✅ Protection
    },
    {
      path: '/admin/form',
      component: FormAdmin,
      name: 'Form',
      meta: { requiresAuth: true, role: 'admin' }, // ✅ Protection
    },
    {
      path: '/admin/form-edit/:id',
      component: FormAdmin, // Menggunakan FormAdmin yang sudah ada
      name: 'EditPage',
      props: true,
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/lihatdata',
      component: LihatDataAdmin,
      name: 'LihatData',
      meta: { requiresAuth: true, role: 'admin' }, // ✅ Protection
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true, role: 'admin' }, // ✅ Protection
    },

    // Super Admin Routes - ✅ TAMBAHKAN META
    {
      path: '/superadmin/dashboard',
      name: 'superadmin dashboard',
      component: SuperAdminView,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/input',
      name: 'formdata superadmin',
      component: FormDataView,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/riwayat',
      name: 'riwayat superadmin',
      component: RiwayatView,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/riwayat-edit/:id',
      name: 'edit riwayat',
      component: RiwayatEditView,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/staff',
      name: 'staff',
      component: Staff,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/staff-add',
      name: 'add staff',
      component: StaffAddEditView,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/staff-edit/:id',
      name: 'edit staff',
      component: StaffAddEditView,
      props: true,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin/rekapdata',
      name: 'rekap data',
      component: RekapDataView,
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },
    {
      path: '/superadmin',
      redirect: '/superadmin/dashboard',
      meta: { requiresAuth: true, role: 'superadmin' }, // ✅ Protection
    },

    {
      path: '/surat-preview/:id',
      name: 'cetak surat',
      component: RiwayatPreviewView,
      props: true,
      meta: { requiresAuth: true },
    },

    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: NotFound,
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
})

// Navigation guard - ✅ SUDAH BENAR
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Check token expiration
  if (authStore.token && !authStore.checkTokenExpiration()) {
    authStore.clearAuth()
  }

  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.userRole

  // Routes that require authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Routes that require specific roles
  const requiredRole = to.meta.role

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (requiredRole && userRole !== requiredRole) {
    next('/unauthorized')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already logged in
    if (userRole === 'admin') {
      next('/admin/dashboard')
    } else if (userRole === 'superadmin') {
      next('/superadmin/dashboard')
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
