import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/Login.vue'
import ResetRequest from '../views/login/ResetPassword.vue'
import ResetPasswordAccepted from '../views/login/ResetPasswordAccepted.vue'
import DashboardAdmin  from '../views/admin/AdminView.vue'
import FormAdmin  from '../views/admin/FormData.vue'
import LihatDataAdmin from '../views/admin/LihatData.vue'
import EditFormData from '../views/admin/EditFormData.vue'
import PreviewPermohonan from '../views/admin/PreviewPermohonan.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Login,
    },
    {
      path: '/admin',
      component: Login,
    },
    {
      path : '/admin/dashboard',
      component: DashboardAdmin,
      name: 'Dashboard'
    },
    {
      path : '/admin/form',
      component: FormAdmin,
      name: 'Form'
    },
    {
      path : '/admin/lihatdata',
      component: LihatDataAdmin,
      name: 'LihatData'
    },
    {
      path : '/admin/resetrequest',
      component: ResetRequest,
      name: 'ResetRequest'
    },
    {
      path : '/admin/resetpasswordaccepted',
      component: ResetPasswordAccepted,
      name: 'ResetPasswordAccepted'
    },
    {
      path : '/admin/editform',
      component: EditFormData,
      name: 'EditPage'
    },
    {
      path : '/admin/previewpermohonan',
      component: PreviewPermohonan,
      name: 'DetailPage' 
    },
    {
      path : '/admin/cetakkwitansi',
      component: () => import('../views/admin/CetakKwitansi.vue'),
      name: 'PrintPage'
    }

  ],
})

export default router
