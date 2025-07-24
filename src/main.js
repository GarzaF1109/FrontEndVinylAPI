import { createApp } from 'vue'
import App from './App.vue'

// Importa Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Importa íconos opcionales (si usas mdi)
import '@mdi/font/css/materialdesignicons.css'

// Crea la instancia de Vuetify
const vuetify = createVuetify({
  components,
  directives,
})

// Crea la app
import './assets/main.css'

createApp(App)
  .use(vuetify)
  .mount('#app')
