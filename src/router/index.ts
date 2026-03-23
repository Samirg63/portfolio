import DefaultLayout from '@/layout/defaultLayout.vue'
import AdminView from '@/views/adminView.vue'
import AuthView from '@/views/authView.vue'
import DefaultView from '@/views/defaultView.vue'
import { createRouter, createWebHistory } from 'vue-router'

//Admin components
import AdminAbout from '@/components/admin/AdminAbout.vue'
import AdminAccount from '@/components/admin/AdminAccount.vue'
import AdminContact from '@/components/admin/AdminContact.vue'
import AdminHome from '@/components/admin/AdminHome.vue'
import AdminProjects from '@/components/admin/AdminProjects.vue'
import AdminTags from '@/components/admin/AdminTags.vue'
import AdminHardskills from '@/components/admin/AdminHardskills.vue'
import ForgotPassword from '@/views/ForgotPassword.vue' 
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/forgotPassword',
      component:ForgotPassword
    },
    {
      path:'/',
      component:DefaultLayout,
      children:[
        {path:'',
          component:DefaultView
        },
        {
          path:'admin',
          component:AdminView,
          children:[
            {
              path:'',
              component:AdminHome
            },
            {
              path:'projects',
              component:AdminProjects
            },
            {
              path:'about',
              component:AdminAbout
            },
            {
              path:'contact',
              component:AdminContact
            },
            {
              path:'account',
              component:AdminAccount
            },
            {
              path:'tags',
              component:AdminTags
            },
            {
              path:'hardskills',
              component:AdminHardskills
            }
          ]
        }
      ]
    },
    {
      path:'/admin/auth',
      component:AuthView
    },
    {
      path:'/**',
      component:NotFound
    }
  ],
})

export default router
