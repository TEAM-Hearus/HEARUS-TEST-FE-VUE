import { createApp } from 'vue';
import App from './App.vue';
import io from 'socket.io-client';

console.log("process.env.VUE_APP_BACKEND_HOST: ", process.env.VUE_APP_BACKEND_HOST)
console.log("window.VUE_APP_K8S :", window.VUE_APP_K8S);
const socket = io(window.VUE_APP_K8S, {
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