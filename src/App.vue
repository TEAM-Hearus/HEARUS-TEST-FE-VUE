<template>
  <div class="background d-flex justify-content-center align-items-center vh-100">
    <div class="card-container text-center">
      <img :src="logoImageSrc" alt="Logo" class="card-item logo-img mb-3" :class="{ 'animated-logo': isRecording }" />
      <button v-if="!isRecording" @click="startRecording" class="card-item btn btn-primary rounded-pill mb-2">음성인식 시작
      </button>
      <button v-if="isRecording" @click="stopRecording" class="card-item stop-btn btn-danger rounded-pill">음성인식
        중단</button>
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
      isRecording: false,
      logoImageSrc: require('@/assets/logo.png'),
    };
  },
  mounted() {
    this.setupSpeechRecognition();
  },
  methods: {
    async setupWebSocket() {
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
      this.socket.send(transcript);
    },
    async startRecording() {
      await this.setupWebSocket();
      this.recognition.start();
      this.isRecording = true;
      console.log("Start Recording");
    },
    stopRecording() {
      this.recognition.stop();
      this.isRecording = false;
      this.recognition.isStarted = false;
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
  margin: 30px;
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

.stop-btn {
  font-size: 15px;
  border-radius: 10px;
  background-color: #ee6b62;
  padding: 10px;
  color: white;
}

@keyframes scaleUp {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animated-logo {
  animation: scaleUp 1s infinite;
}
</style>
