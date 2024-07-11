<script src='@/scripts/questionScript.js'></script>
<template>
    <div class="question-page">
      <div class="content-container">
        <div class="input-container" v-if="!isLoading && !isInput">
            <textarea v-model="accessToken" placeholder="Access Token 입력" class="json-input"></textarea>
            <textarea v-model="jsonData" placeholder="JSON Body 입력" class="json-input"></textarea>
            <button @click="generateProblems" class="generate-btn">문제 생성하기</button>
        </div>

        <div v-if="isLoading" class="loading-screen">
            <image :src="loadingImage" alt="Loading" style="width: 200px; height: 200px;"/>
            <p>문제를 생성하고 있습니다. 잠시만 기다려주세요{{ loadingDots }}</p>
        </div>
  
        <div v-if="!isLoading && isInput">
            <div v-for="(question, index) in questions" :key="index" class="question">
            <div v-if="question.type === 'MultipleChoice'">
            <div class="question-title">{{ index + 1 }}. <span class="direction">{{ question.direction }}</span></div>
            <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="option">
                <input type="radio" :id="`question-${index}-option-${optionIndex}`" :value="optionIndex" v-model="question.selectedOption">
                <label :for="`question-${index}-option-${optionIndex}`">{{ option }}</label>
            </div>
            </div>

            <div v-if="question.type === 'ShrotAnswer'">
            <div class="question-title">{{ index + 1 }}. <span class="direction">{{ question.direction }}</span></div>
            <input type="text" v-model="question.answer" class="answer-input">
            </div>

            <div v-if="question.type === 'BlanckQuestion'">
            <div class="question-title">{{ index + 1 }}. <span class="direction">{{ question.direction }}</span></div>
            <input type="text" v-model="question.answer" class="answer-input">
            </div>

            <div v-if="question.type === 'OXChoice'">
            <div class="question-title">{{ index + 1 }}. <span class="direction">{{ question.direction }}</span></div>
            <div class="ox-options">
                <input type="radio" :id="`question-${index}-option-0`" value="0" v-model="question.selectedOption">
                <label :for="`question-${index}-option-0`">O</label>
                <input type="radio" :id="`question-${index}-option-1`" value="1" v-model="question.selectedOption">
                <label :for="`question-${index}-option-1`">X</label>
            </div>
            </div>
        </div>
      </div>
      <button v-if="isInput" class="submit-btn">제출</button>
      </div>
    </div>
</template>