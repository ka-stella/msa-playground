import { createRouter, createWebHistory } from "vue-router";
import { authApi } from "@/api/auth";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import OcrxView from "@/views/OcrxView.vue";
import MemoEditorView from "@/views/MemoEditorView.vue";
import MemoListView from "@/views/MemoListView.vue";
import EditorView from "@/views/EditorView.vue";

const routes = [
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
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/ocrx",
    name: "ocrx",
    component: OcrxView,
    meta: { requiresAuth: true },
  },
  {
    path: "/memos",
    name: "memos",
    component: MemoListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/memos/:id",
    name: "memo-editor",
    component: MemoEditorView,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/editor",
    name: "memo-editor",
    component: EditorView,
    meta: { requiresAuth: true },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
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
    return next({ name: "home" });
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
