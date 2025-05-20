import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/Login.vue'
import SuperAdminView from '@/views/superadmin/SuperAdminView.vue'
import RiwayatView from '@/views/superadmin/RiwayatView.vue'
import RiwayatEditView from '@/views/superadmin/RiwayatEditView.vue'
import Staff from '@/views/superadmin/StaffView.vue'
import FormDataView from '@/views/superadmin/FormDataView.vue'
import StaffAddEditView from '../views/superadmin/StaffAddEditView.vue'
import RekapDataView from '../views/superadmin/RekapDataView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'superadmin dashboard',
      component: SuperAdminView,
    },
    {
      path: '/input',
      name: 'formdata superadmin',
      component: FormDataView,
    },
    {
      path: '/riwayat',
      name: 'riwayat superadmin',
      component: RiwayatView,
    },
    {
      path: '/riwayat-edit/:id',
      name: 'edit riwayat',
      component: RiwayatEditView,
    },
    {
      path: '/staff',
      name: 'staff',
      component: Staff,
    },
    {
      path: '/staff-add',
      name: 'add staff',
      component: StaffAddEditView,
    },
    {
      path: '/staff-edit/:id',
      name: 'edit staff',
      component: StaffAddEditView,
      props: true,
    },
    {
      path: '/rekapdata',
      name: 'rekap data',
      component: RekapDataView,
    },
  ],
})

export default router
