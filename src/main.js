import { createApp } from 'vue';
import App from './App.vue';
import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_BACKEND_LOCALHOST, {
    withCredentials: true,
    extraHeaders: {
        "extra-custom-headers": "localhost"
    }
});

const app = createApp(App);
app.provide('socket', socket);
app.config.productionTip = false;

app.mount('#app');