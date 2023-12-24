import '@/styles/appStyle.css';
import { inject } from 'vue';

export default {
    data() {
        return {
            clientToken: '',
            socket: null,
            recognitionResult: '',
            scriptData: ["음성 인식을 시작해보세요"],
            stream: null,
            mediaRecorder: null,
            isRecording: false,
            resCnt: 0,
            logoImageSrc: require('@/assets/logo.png'),
        };
    },
    computed: {
        scriptDataText() {
            return this.scriptData.join(' ');
        },
    },
    methods: {
        initMediaRecorder() {
            const options = { mimeType: 'audio/webm;codecs=opus' };
            this.mediaRecorder = new MediaRecorder(this.stream, options);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.socket.emit('clientData', this.clientToken);
                    this.socket.emit('audioData', event.data);
                }
            };

            this.mediaRecorder.start();
        },

        async startRecording() {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.initMediaRecorder();

            this.scriptData = [' '];
            this.resCnt = 0;
            this.isRecording = true;

            this.sendAudioDataInterval = setInterval(async () => {
                await this.mediaRecorder.requestData();
                await this.mediaRecorder.stop();
                this.initMediaRecorder();
            }, 2000);
        },

        stopRecording() {
            this.isRecording = false;
            this.recognitionResult = '';
            if (this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
            this.stream.getTracks().forEach(track => track.stop());
            clearInterval(this.sendAudioDataInterval);
        },

        generateRandomToken(length = 10) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < length; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return token;
        },
    },
    mounted() {
        this.clientToken = this.generateRandomToken();
        console.log(this.clientToken);

        this.socket = inject('socket');
        this.socket.on('recognitionResult', (result) => {
            console.log('Recognition Result : ' + result)
            this.recognitionResult = result;
            this.resCnt += 1;

            if (this.isRecording) {
                this.scriptData.push(this.recognitionResult);
            } else {
                this.recognitionResult = '';
            }

            const textArea = this.$refs.scrollableText;
            textArea.scrollTop = textArea.scrollHeight;
        });
    },
};