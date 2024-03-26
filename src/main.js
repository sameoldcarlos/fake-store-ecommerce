import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueFeather from 'vue-feather';
import { createPinia } from 'pinia';
import AppDB from './utils/appIndexedDb.js';

import data from './content.json' assert { type: 'json' }


(async () => {
  await AppDB.openAppDB('user_store')
})()

const pinia = createPinia()
const app = createApp(App)

app.component(VueFeather.name, VueFeather)

app.use(router)
app.use(pinia)
app.provide('appTextData', data)

app.mount('#app')
