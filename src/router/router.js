import { createRouter, createWebHistory } from 'vue-router';
import QuestionPage from '../components/QuestionPage.vue';

const routes = [
    {
        path: '/questions',
        name: 'QuestionPage',
        component: QuestionPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;