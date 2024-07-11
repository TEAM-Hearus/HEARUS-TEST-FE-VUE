<script src='@/scripts/appScript.js'></script>
<template>
  <div class="background d-flex justify-content-center align-items-center vh-100">
    <div v-if="!isQuestionPage" class="text-center">
      <div class="logo-container" @click="isRecording ? stopRecording() : startRecording()">
        <img :src="isRecording ? recordingLogoImageSrc : logoImageSrc" alt="Logo" class="card-item logo-img mb-3"
          :class="{ 'animated-logo': isRecording }" />
      </div>
      <div class="script-container text-center">
        <div class="scrollable-text">
          <div ref="scrollableText" class="scrollable-content">
          <template v-for="(item, index) in formattedScriptText" :key="index">
            <span v-if="item.type === 'comment'" @click="showPopup($event, item.index)" :style="{
              color: 'white', cursor: 'pointer', display: 'inline',
              borderBottom: '3px solid #FF6B3D', paddingBottom: '0px'
            }">
              {{ item.text }}
            </span>
            <span v-else-if="item.type === 'highlight'" :style="{ color: '#FFFD38', display: 'inline' }">
              {{ item.text }}
            </span>
            <br v-else-if="item.type === 'br'" />
            <span v-else :style="{ color: 'white', display: 'inline' }">
              {{ item.text }}
            </span>
            <span v-if="item.type !== 'br'" :style="{ color: 'white', display: 'inline' }">&nbsp;</span>
          </template>
        </div>
      </div>
      <button @click="goToQuestionPage" class="btn btn-primary btn-lg mt-4">문제 생성 페이지로 이동</button>
      <div class="subtitles">{{ recognitionResult }}</div>
    </div>
  </div>
  <router-view v-else></router-view>
</div>

  <!-- Popup Box -->
  <div v-if="showPopupFlag" class="popup-box" ref="popupBox" @click.self="hidePopup" :style="popupStyle">
    {{ popupContent }}
  </div>
</template>