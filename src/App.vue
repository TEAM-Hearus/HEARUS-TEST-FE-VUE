<script src='@/scripts/appScript.js'></script>
<template>
  <div class="background d-flex justify-content-center align-items-center vh-100">
    <div class="card-container text-center">
      <img :src="logoImageSrc" alt="Logo" class="card-item logo-img mb-3" :class="{ 'animated-logo': isRecording }" />
      <button v-if="!isRecording" @click="startRecording" class="card-item btn btn-primary rounded-pill mb-2">음성인식 시작
      </button>
      <button v-if="isRecording" @click="stopRecording" class="card-item stop-btn btn-danger rounded-pill">음성인식
        중단</button>
    </div>
    <div class="script-container text-center">
      <textarea ref="scrollableText" class="scrollable-text" readonly v-model="scriptDataText"></textarea>
    </div>
    <div class="subtitles">{{ recognitionResult }}</div>
  </div>
</template>