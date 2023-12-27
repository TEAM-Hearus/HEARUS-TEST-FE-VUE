import '@/styles/appStyle.css';
import { inject } from 'vue';

export default {
    data() {
        return {
            clientToken: '',
            socket: null,
            recognitionResult: '',
            stream: null,
            mediaRecorder: null,
            isRecording: false,
            resCnt: 0,
            logoImageSrc: require('@/assets/logo.png'),

            // Script Data, NLP Processing
            // ["TextData", "Tag". "comment"]
            // Tag Example
            // none=효과없음 highlight=하이라이팅
            // comment=GPTAPI로부터 부가설명 br=줄바꿈
            scriptData: [
                ["버튼을", "none", ""],
                ["눌러", "none", ""],
                ["음성인식을", "none", ""],
                ["시작해보세요", "none", ""],
                ["", "br", ""],
                ["", "br", ""],
                ["중요한 내용은", "none", ""],
                ["하이라이트", "highlight", ""],
                ["처리가 되고", "none", ""],
                ["", "br", ""],
                ["추가 설명이 필요한 부분은", "none", ""],
                ["별도로", "comment", "해당 키워드에 대한 추가 설명입니다"],
                ["표시됩니다", "none", ""],
            ],
            preProcessedLen: 0,
        };
    },
    computed: {
        formattedScriptText() {
            return this.scriptData.map(data => {
                if (data[1] === 'highlight') {
                    return `<span style="background-color: #FF9900;">${data[0]}</span>`;
                } else if (data[1] === 'comment') {
                    return `<span style="background-color: #337ea9;">${data[0]}</span>`;
                } else if (data[1] === 'br') {
                    return '</br>';
                } else {
                    return data[0];
                }
            }).join(' ');
        }
    },
    methods: {
        initMediaRecorder() {
            const options = { mimeType: 'audio/webm;codecs=opus' };
            this.mediaRecorder = new MediaRecorder(this.stream, options);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // this.socket.emit('clientData', this.clientToken);
                    this.socket.emit('transcription', event.data);
                }
            };

            this.mediaRecorder.start();
        },

        async startRecording() {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.initMediaRecorder();

            this.scriptData = [];
            this.resCnt = 0;
            this.isRecording = true;

            this.sendAudioDataInterval = setInterval(async () => {
                await this.mediaRecorder.requestData();
                await this.mediaRecorder.stop();
                this.initMediaRecorder();
            }, 3000);
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