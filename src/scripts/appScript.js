import '@/styles/appStyle.css';
import { inject } from 'vue';

export default {
    data() {
        return {
            socket: null,
            recognitionResult: '',
            scriptData: ["음성 인식을 시작해보세요"],
            mediaRecorder: null,
            isRecording: false,
            resCnt: 0,
            logoImageSrc: require('@/assets/logo.png'),
        };
    },
    computed: {
        scriptDataText() {
            return this.scriptData.join('\n');
        },
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
            this.scriptData = [];
            this.resCnt = 0;
            this.isRecording = true;

            this.sendAudioDataInterval = setInterval(() => {
                this.mediaRecorder.requestData();
            }, 1000);
        },

        stopRecording() {
            this.isRecording = false;
            this.recognitionResult = '';
            if (this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
            clearInterval(this.sendAudioDataInterval);
        },
    },
    mounted() {
        this.socket = inject('socket');
        this.socket.on('recognitionResult', (result) => {
            this.recognitionResult = result;
            this.resCnt += 1;

            if (this.isRecording) {
                this.recognitionResult = " " + this.resCnt + "번째 변환 결과 자막입니다. ";
                this.scriptData.push(this.recognitionResult);
            } else {
                this.recognitionResult = '';
            }

            const textArea = this.$refs.scrollableText;
            textArea.scrollTop = textArea.scrollHeight;
        });
    },
};