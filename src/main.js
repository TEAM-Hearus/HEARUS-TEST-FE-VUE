import { createApp } from 'vue';
import App from './App.vue';
import io from 'socket.io-client';

console.log(process.env.VUE_APP_BACKEND_HOST);
const socket = io(process.env.VUE_APP_BACKEND_HOST, {
    // Auto Reconnect
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionAttempts: Infinity,
    transports: ["websocket"],
    withCredentials: true,
});

const app = createApp(App);
app.provide('socket', socket);
app.config.productionTip = false;

app.mount('#app');