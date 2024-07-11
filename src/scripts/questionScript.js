import '@/styles/questionStyle.css';
import axios from 'axios';

export default {
    name: 'QuestionPage',
    data() {
        return {
            loadingImage: require('@/assets/loading.gif'),
            isLoading: false,
            loadingDots: '.',
            isInput: false,
            loadingInterval: null,
            accessToken: '',
            jsonData: '',
            questions: [],
        };
    },
    methods: {
        async generateProblems() {
            try {
                this.isLoading = true;
                this.startLoadingAnimation();

                const response = await axios.post(`${process.env.VUE_APP_BACKEND_HOST}/api/v1/lecture/generateProblems`, JSON.parse(this.jsonData), {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.accessToken}`, // Authorization 헤더 추가
                    },
                    timeout: 180000, // 3분 (180000ms)
                });

                this.questions = response.data.object;
                this.isInput = true;
            } catch (error) {
                console.error('문제 생성 오류:', error);
            } finally {
                this.isLoading = false;
                this.stopLoadingAnimation();
            }
        },
        startLoadingAnimation() {
            let count = 0;
            const maxCount = 3;

            this.loadingInterval = setInterval(() => {
                count = (count + 1) % (maxCount + 1);
                this.loadingDots = '.'.repeat(count);
                console.log(count);
            }, 1000);
        },
        stopLoadingAnimation() {
            clearInterval(this.loadingInterval);
            this.loadingDots = '.';
        },
    },
};