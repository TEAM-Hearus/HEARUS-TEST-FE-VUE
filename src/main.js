import { createApp } from 'vue';
import App from './App.vue';
import io from 'socket.io-client';
import router from './router/router.js';

console.log("process.env.VUE_APP_BACKEND_HOST : ", process.env.VUE_APP_BACKEND_HOST)
console.log("process.env.VUE_APP_SOCKETIO_HOST : ", process.env.VUE_APP_SOCKETIO_HOST)
console.log("window.VUE_APP_K8S : ", window.VUE_APP_K8S);

let socketUrl = process.env.NODE_ENV === 'development'
  ? `${process.env.VUE_APP_SOCKETIO_HOST}`
  : `${window.VUE_APP_K8S}`;
console.log("socketURL : ", socketUrl)

const socket = io(socketUrl, {
  path: '/socket.io',
  transports: ['websocket'],
  extraHeaders: {
    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits'
  },
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: Infinity
});

socket.on('connect', () => {
  const lectureId = '668cceb8ebef2b4462de0fb5';
  socket.emit('lectureId', lectureId);
});

const app = createApp(App);
app.use(router);
app.provide('socket', socket);
app.config.productionTip = false;

app.mount('#app');