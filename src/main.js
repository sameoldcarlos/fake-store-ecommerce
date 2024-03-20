import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueFeather from 'vue-feather';
import AppDB from './utils/appIndexedDb.js';


(async () => {
  await AppDB.openAppDB('user_store')
})()

const app = createApp(App)

app.component(VueFeather.name, VueFeather)

app.use(router)

app.mount('#app')
