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
      <div ref="scrollableText" class="scrollable-text">
        <template v-for="(item, index) in formattedScriptText" :key="index">
          <span v-if="item.type === 'comment'" @click="showPopup($event, item.index)" :style="{
            color: 'white', cursor: 'pointer', display: 'inline',
            borderBottom: '3px solid #337ea9', paddingBottom: '0px'
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
    <div class="subtitles">{{ recognitionResult }}</div>
  </div>

  <!-- Popup Box -->
  <div v-if="showPopupFlag" class="popup-box" ref="popupBox" @click.self="hidePopup" :style="popupStyle">
    {{ popupContent }}
  </div>
</template>