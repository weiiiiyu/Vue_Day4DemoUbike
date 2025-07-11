import { createRouter, createWebHistory } from 'vue-router'
import Ubike from '@/components/Ubike.vue'
import Collection from '@/components/collection.vue'

const routes = [
  {
    path: '/',
    redirect: '/ubike'
  },
  {
    path: '/ubike',
    name: 'Ubike',
    component: Ubike
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
