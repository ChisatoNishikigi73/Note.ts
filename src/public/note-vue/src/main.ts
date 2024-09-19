import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HelloWorld from './components/HelloWorld.vue'
 import Room from './components/Room.vue'

const routes = [
  { path: '/', component: HelloWorld },
   { path: '/room/:id', name: 'Room', component: Room }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
