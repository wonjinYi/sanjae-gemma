import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

// 뷰 불러오기 ------------------------------------
// 공통 뷰
import NotFoundView from '@/views/NotFoundView.vue';
import MainView from '@/views/MainView.vue';
import SearchView from '@/views/SearchView.vue';
import DetailView from '@/views/DetailView.vue';
import ReportView from '@/views/ReportView.vue';

// 라우터 설정 ------------------------------------
const routes = [
	// 공통 뷰
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: NotFoundView,
	},
	{
		path: '/',
		name: 'Main',
		component: MainView,
	},
	{
		path: '/search',
		name: 'Search',
		component: SearchView,
	},
	{
		path : '/detail',
		// path: '/detail:id',
		name: 'Detail',
		component: DetailView,
	},
	{
		path : '/report',
		name: 'Report',
		component: ReportView,
	},
];

// 라우터 객체 생성
const router = createRouter({
	history: createWebHashHistory(),
	routes,
	scrollBehavior(/*to, from, savedPosition*/) {
		return { top: 0 , behavior: 'smooth',};
	},
});

export default router;
