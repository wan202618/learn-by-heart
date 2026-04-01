// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 动态导入页面组件
const UserLogin = () => import('../views/UserLogin.vue');
const UserRegister = () => import('../views/UserRegister.vue');
const ProfileModify = () => import('../views/ProfileModify.vue');

const routes = [
  { path: '/', redirect: '/login' }, // 默认跳转到登录页
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  {
    path: '/profile',
    component: ProfileModify,
    meta: { requiresAuth: true } // 需要登录才能访问
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 简单的路由守卫（拦截未登录访问个人中心）
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token');
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;