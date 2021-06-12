// import { DASHBOARD_ROUTE_NAME, LOGIN_ROUTE_NAME, PRIVATE_ROUTE_NAME } from '@/constants/routes'
// import { checkAuth, checkNonAuth } from './middleware'

export default [
  {
    path: '/',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: 'home' */ '@/views/Dashboard.vue')
  }
]
