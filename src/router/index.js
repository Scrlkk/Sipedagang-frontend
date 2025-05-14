import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login/Login.vue'
import DashboardAdmin  from '../views/admin/AdminView.vue'
import FormAdmin  from '../views/admin/FormData.vue'
import LihatDataAdmin from '../views/admin/LihatData.vue'

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
    }
  ],
})

export default router
