// frontend/src/router/index.js
import { createRouter, createWebHashHistory } from "vue-router";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/login",
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// --- グローバルナビゲーションガード ---
router.beforeEach((to, from, next) => {
  // 認証が必要なルート
  const requiresAuth = to.meta.requiresAuth;

  // ユーザーが認証済みか確認
  const isAuthenticated = localStorage.getItem("access_token");
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (
    !requiresAuth &&
    isAuthenticated &&
    (to.path === "/login" || to.path === "/register")
  ) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
