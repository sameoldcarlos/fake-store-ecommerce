import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueFeather from 'vue-feather';
import CartDB from './utils/IndexedDbCart';


await CartDB.openCartDB()

const app = createApp(App)

app.component(VueFeather.name, VueFeather)

app.use(router)

app.mount('#app')
