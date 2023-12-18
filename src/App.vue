<template>
  <div class="background d-flex justify-content-center align-items-center vh-100">
    <div class="card-container text-center">
      <img src="@/assets/logo.png" alt="Logo" class="card-item logo-img mb-3" />
      <button @click="startRecording" class="card-item btn btn-primary rounded-pill mb-2">음성 인식 시작</button>
      <button @click="stopRecording" class="card-item btn btn-danger rounded-pill">음성 인식 중단</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subtitle: '',
      recognition: null,
      socket: null,
    };
  },
  mounted() {
    this.setupWebSocket();
    this.setupSpeechRecognition();
  },
  methods: {
    setupWebSocket() {
      this.socket = new WebSocket('ws://your-backend-server/websocket-endpoint');

      this.socket.addEventListener('message', (event) => {
        this.subtitle = event.data;
      });
    },
    setupSpeechRecognition() {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.lang = 'en-US'; // Set the language accordingly

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.sendSpeechToServer(transcript);
      };
    },
    sendSpeechToServer(transcript) {
      // Send the speech data to the server through WebSocket
      this.socket.send(transcript);
    },
    startRecording() {
      this.recognition.start();
    },
    stopRecording() {
      this.recognition.stop();
    },
  },
};
</script>

<style>
body {
  background-color: #121212;
  margin: 0;
}

.background {
  height: 100vh;
}

.card-container {
  border-radius: 20px;
  width: 30%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
}

.card-item {
  margin: 15px;
}

.logo-img {
  border-radius: 100px;
  width: 150px;
}

.btn {
  font-size: 15px;
  border-radius: 10px;
  background-color: #337ea9;
  padding: 10px;
  color: white;
}
</style>
