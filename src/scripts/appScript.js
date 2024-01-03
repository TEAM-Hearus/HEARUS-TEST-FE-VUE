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

            // ["TextData", "Tag". "comment"]
            // Tag Example
            // none=효과없음 highlight=하이라이팅
            // comment=GPTAPI로부터 부가설명 br=줄바꿈
            scriptData: [],
            defaultScript: [
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
                ["클릭하여", "none", ""],
                ["추가설명을", "comment", "해당 키워드에 대한 추가 설명입니다"],
                ["확인할 수 있습니다.", "none", ""],
                ["", "br", ""],
                ["", "br", ""],
            ],
            preProcessedLen: 0,

            // Popup Data properties
            showPopupFlag: false,
            popupContent: '',
            popupStyle: {},
            hidePopupTimeout: null,
        };
    },
    computed: {
        formattedScriptText() {
            return this.scriptData.map((data, index) => {
                return {
                    text: data[0],
                    type: data[1],
                    comment: data[2],
                    index: index
                };
            });
        },
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
            this.scriptData = this.defaultScript;
            this.preProcessedLen = 0;

            this.resCnt = 0;
            this.isRecording = true;

            this.sendAudioDataInterval = setInterval(async () => {
                await this.mediaRecorder.requestData();
                await this.mediaRecorder.stop();
                this.initMediaRecorder();
            }, 5000);

            this.sendTextDataInterval = setInterval(async () => {
                if (this.preProcessedLen != this.scriptData.length) {
                    const arrStart = this.preProcessedLen;
                    const arrEnd = this.scriptData.length;
                    const unProcessedText = this.scriptData.slice(arrStart, arrEnd);
                    const sumText = unProcessedText.map(data => { return data[0]; }).join(' ');

                    const textData = JSON.stringify({
                        arrStart: arrStart,
                        arrEnd: arrEnd,
                        unProcessedText: unProcessedText,
                        sumText: sumText
                    });
                    this.socket.emit('nlProcessing', textData);
                    this.preProcessedLen = this.scriptData.length
                }
            }, 7000);
        },

        stopRecording() {
            this.isRecording = false;
            this.recognitionResult = '';
            if (this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
            this.stream.getTracks().forEach(track => track.stop());
            clearInterval(this.sendAudioDataInterval);
            clearInterval(this.sendTextDataInterval);
        },

        generateRandomToken(length = 10) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < length; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return token;
        },

        // popup-box
        showPopup(event, index) {
            console.log("showPopup triggered");

            event.stopPropagation();
            const comment = this.scriptData[index][2];
            if (comment) {
                this.popupContent = comment;
                this.popupStyle = {
                    left: `${event.clientX}px`,
                    top: `${event.clientY}px`
                };
                this.showPopupFlag = true;
            }
            clearTimeout(this.hidePopupTimeout);
            // this.hidePopupTimeout = setTimeout(() => {
            //     this.hidePopup();
            // }, 60000);

            this.$nextTick(() => {
                window.addEventListener('click', this.handleOutsideClick);
            });
        },
        hidePopup() {
            this.showPopupFlag = false;

            // clearTimeout(this.hidePopupTimeout);
            window.removeEventListener('click', this.handleOutsideClick);
        },
        handleOutsideClick(event) {
            console.log("handleOutsideClick triggered");
            let popupElement = this.$refs.popupBox;
            if (popupElement && !popupElement.contains(event.target)) {
                this.hidePopup();
            }
        }
    },
    mounted() {
        this.scriptData = this.defaultScript;
        this.clientToken = this.generateRandomToken();
        console.log(this.clientToken);

        this.socket = inject('socket');
        this.socket.on('recognitionResult', (result) => {
            console.log('Recognition Result: ' + result);
            this.recognitionResult = result;
            this.resCnt += 1;

            if (this.isRecording && result.trim() !== '') {
                const words = result.split(' ');

                words.forEach(word => {
                    if (word.trim() !== '') {
                        const tmp = [word, "none", ""];
                        this.scriptData.push(tmp);
                    }
                });
            } else {
                this.recognitionResult = '';
            }

            const textArea = this.$refs.scrollableText;
            if (textArea.scrollHeight) {
                textArea.scrollTop = textArea.scrollHeight;
            }
        });


        this.socket.on('NLPResult', (result) => {
            console.log('NLP Result : ' + result)
            let nlpResult = typeof result === 'string' ? JSON.parse(result) : result;
            const { arrStart, arrEnd, unProcessedText } = nlpResult;
            this.scriptData.splice(arrStart, arrEnd - arrStart, ...unProcessedText);
        });
    },
};