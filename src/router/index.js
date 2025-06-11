import { createWebHistory, createRouter } from 'vue-router'

import MoviesList from '@/views/MoviesList.vue'


const routes = [
  { path: '/', redirect: '/movies', },
  { path: '/movies', component: MoviesList}

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router