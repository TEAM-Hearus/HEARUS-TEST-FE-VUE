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
import { inject } from 'vue';

export default {
  data() {
    return {
      socket: null,
      recognitionResult: '',
      mediaRecorder: null,
      isRecording: false,
      logoImageSrc: require('@/assets/logo.png'),
    };
  },
  methods: {
    async startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.socket.emit('audioData', event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        this.isRecording = false;
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    },
    stopRecording() {
      this.isRecording = false;
      if (this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
      }
    },
  },
  mounted() {
    this.socket = inject('socket');
    this.socket.on('recognitionResult', (result) => {
      this.recognitionResult = result;
      console.log(this.recognitionResult);
    });
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
