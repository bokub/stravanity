import { createApp } from 'vue';
import App from './App.vue';
import Cookies from 'js-cookie';

if (Cookies.get('refresh_token') && !Cookies.get('access_token')) {
  window.location.replace(`/api/login?refresh=true&code=${Cookies.get('refresh_token')}`);
}

createApp(App).mount('#app');
