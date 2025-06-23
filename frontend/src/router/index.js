import { createRouter, createWebHashHistory } from "vue-router";
import { authApi } from "@/api/auth";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/login",
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { guestOnly: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { guestOnly: true },
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

router.beforeEach(async (to, from, next) => {
  //ログイン中か確認
  let isAuthenticated = false;
  try {
    const response = await authApi.checkAuthStatus();
    if (response.status === 200) {
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
  } catch (error) {
    isAuthenticated = false;
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: "dashboard" });
  }

  // 認証が必要なルートへのアクセス
  if (to.meta.requiresAuth) {
    if (isAuthenticated) {
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
