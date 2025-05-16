import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/Login.vue'
import ResetRequest from '../views/login/ResetPassword.vue'
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
      path : '/dashboard',
      component: DashboardAdmin  ,
    },
    {
      path : '/form',
      component: FormAdmin ,
    },
    {
      path : '/lihatdata',
      component: LihatDataAdmin ,
    },
     {
      path : '/resetrequest',
      component: ResetRequest ,
    },
    {
      path : '/editform',
      component: EditFormData ,
    },
      {
      path : '/previewpermohonan',
      component: PreviewPermohonan ,
    }

  ],
})

export default router
