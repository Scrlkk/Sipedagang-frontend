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
      path : '/admin/dashboard',
      component: DashboardAdmin  ,
    },
    {
      path : '/admin/form',
      component: FormAdmin ,
    },
    {
      path : '/admin/lihatdata',
      component: LihatDataAdmin ,
    },
     {
      path : '/admin/resetrequest',
      component: ResetRequest ,
    },
    {
      path : '/admin/resetpasswordaccepted',
      component: ResetPasswordAccepted ,
    },
    {
      path : '/admin/editform',
      component: EditFormData ,
    },
      {
      path : '/admin/previewpermohonan',
      component: PreviewPermohonan ,
    }

  ],
})

export default router
