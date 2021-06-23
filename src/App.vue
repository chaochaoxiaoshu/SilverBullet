<template>
  <div id="app">
    <!-- 左侧导航栏 -->
    <div id="tab">
      <!-- Logo -->
      <div class="logo-box">
        <img class="logo" src="@/assets/icons/Logo.png" alt="Logo" />
        <svg-icon icon-class="Logo" id="logo-text"></svg-icon>
      </div>
      <!-- 用户信息 -->
      <div class="user" @click="changeThemes('blue')">
        <!-- 头像 -->
        <div class="profile">U</div>
        <!-- 用户名 -->
        <p class="username">User Name</p>
      </div>
      <!-- 路由按钮 -->
      <router-link
        v-for="(router, index) in routers"
        :key="index"
        class="nav"
        :class="[router.class, { checked: router.to == selectPath }]"
        :to="router.to"
      >
        <svg-icon :icon-class="router.iconClass"></svg-icon>
        <span class="nav-name">{{ router.value }}</span>
      </router-link>
      <!-- 待办分类 -->
      <div class="color">
        <div class="color-title">分类</div>
        <div v-for="(list, index) in classLists" :key="index" class="color-li">
          <div class="list-class" :style="{ borderColor: list.secondaryColor }">
            <div
              class="base-list-class"
              :style="{ backgroundColor: list.color }"
            ></div>
          </div>
          <span>{{ list.name }}</span>
        </div>
      </div>
    </div>
    <!-- 主视区 -->
    <div class="main">
      <!-- 头部 -->
      <div class="header">
        <input class="search" type="text" placeholder="搜索暂不可用" />
        <div class="message"></div>
      </div>
      <!-- 页面 -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectPath: "/",
      routers: [
        {
          class: "my-todo",
          iconClass: "icon-todo",
          value: "我的待办",
          to: "/",
        },
        {
          class: "dashboard",
          iconClass: "icon-form",
          value: "数据统计",
          to: "/Dashboard",
        },
        {
          class: "setting",
          iconClass: "icon-setting",
          value: "设置",
          to: "/setting",
        },
        {
          class: "about",
          iconClass: "icon-about",
          value: "关于",
          to: "/about",
        },
      ],
      themeColors: {
        blue: [
          "#eff6ff",
          "#dbeafe",
          "#bfdbfe",
          "#93c5fd",
          "#60a5fa",
          "#3b82f6",
          "#2563eb",
          "#1d4ed8",
          "#1e40af",
          "#1e3a8a",
          "rgba(43, 149, 252, 0.15)",
          "#14B8A6",
        ],
        emerald: [
          "#ECFDF5",
          "#D1FAE5",
          "#A7F3D0",
          "#6EE7B7",
          "#34D399",
          "#10B981",
          "#059669",
          "#047857",
          "#065F46",
          "#064E3B",
          "rgba(20, 184, 166, 0.15)",
          "#FBBF24",
        ],
        rose: [
          "#FFF1F2",
          "#FFE4E6",
          "#FECDD3",
          "#FDA4AF",
          "#FB7185",
          "#F43F5E",
          "#E11D48",
          "#BE123C",
          "#9F1239",
          "#881337",
          "rgba(244, 63, 94, 0.15)",
          "#F59E0B",
        ],
        orange: [
          "#FFF7ED",
          "#FFEDD5",
          "#FED7AA",
          "#FDBA74",
          "#FB923C",
          "#F97316",
          "#EA580C",
          "#C2410C",
          "#9A3412",
          "#7C2D12",
          "rgba(255, 179, 92, 0.15)",
          "#EF4444",
        ],
      },
      classLists: [
        {
          name: "红色",
          color: "var(--class-red)",
          secondaryColor: "var(--class-red-sec)",
        },
        {
          name: "蓝色",
          color: "var(--class-blue)",
          secondaryColor: "var(--class-blue-sec)",
        },
        {
          name: "绿色",
          color: "var(--class-emerald)",
          secondaryColor: "var(--class-emerald-sec)",
        },
        {
          name: "橘色",
          color: "var(--class-orange)",
          secondaryColor: "var(--class-orange-sec)",
        },
      ],
      declaration: document.styleSheets[0].cssRules[0].style,
    };
  },
  watch: {
    // 侦听路由选中
    $route(to) {
      this.selectPath = to.path;
    },
  },
  methods: {
    // 更换主题
    changeThemes(theme) {
      for (let i = 1; i <= 10; i++)
        this.declaration.setProperty(
          "--Theme-" + i,
          this.themeColors[theme][i - 1]
        );
      this.declaration.setProperty("--Theme-A2", this.themeColors[theme][10]);
      this.declaration.setProperty("--Vice-Theme", this.themeColors[theme][11]);
      this.$store.commit("changeTheme", theme);
    },
  },
  mounted() {
    this.$store.state.classLists = this.classLists;
    // 加载主题
    this.changeThemes(this.$store.state.theme);
  },
};
</script>

<style>
:root {
  /* 颜色变量 */
  --BG: #fff;
  --Gray-1: rgba(15, 23, 42, 0.02);
  --Gray-2: rgba(15, 23, 42, 0.04);
  --Gray-3: rgba(15, 23, 42, 0.06);
  --Gray-4: rgba(15, 23, 42, 0.15);
  --Gray-5: rgba(15, 23, 42, 0.25);
  --Gray-6: rgba(15, 23, 42, 0.45);
  --Gray-7: rgba(15, 23, 42, 0.65);
  --Gray-8: rgba(15, 23, 42, 0.85);
  --Gray-9: rgba(15, 23, 42, 0.1);
  --Theme-1: #eff6ff;
  --Theme-2: #dbeafe;
  --Theme-3: #bfdbfe;
  --Theme-4: #93c5fd;
  --Theme-5: #60a5fa;
  --Theme-6: #3b82f6;
  --Theme-7: #2563eb;
  --Theme-8: #1d4ed8;
  --Theme-9: #1e40af;
  --Theme-10: #1e3a8a;
  --Theme-A2: rgba(43, 149, 252, 0.15);
  --Vice-Theme: #14b8a6;
  /* 分类列表 */
  --class-red: #ef4444;
  --class-red-sec: #fee2e2;
  --class-blue: #3b82f6;
  --class-blue-sec: #dbeafe;
  --class-emerald: #10b981;
  --class-emerald-sec: #d1fae5;
  --class-orange: #f97316;
  --class-orange-sec: #ffedd5;
}
* {
  /* CSS初始化 */
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-family: PingFang SC, Microsoft Yahei, sans-serif;
  user-select: none;
}
input {
  user-select: auto;
}
textarea {
  user-select: auto;
}
input {
  background: none;
  outline: none;
}
input:focus {
  border: none;
}
a,
a:hover,
a:active,
a:visited {
  text-decoration: none;
}
body {
  background-color: #f1f2f6;
  overflow-x: hidden;
}
#app {
  display: flex;
}
/* 左侧导航栏 */
#tab {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 15.5rem;
  height: 100vh;
  overflow: hidden;
  background-color: var(--BG);
}
.logo-box {
  display: flex;
  align-items: center;
  width: 11.5rem;
  height: 3.5rem;
  margin-top: 3rem;
  padding-left: 0.2rem;
}
.logo {
  width: 3rem;
  height: 3rem;
  margin-right: 1rem;
}
#logo-text {
  color: var(--Gray-8);
  width: 3rem;
  height: 1.5rem;
}
/* 用户信息 */
.user {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 2rem 0 1.5rem 0;
  width: 11.5rem;
  height: 3rem;
  border-radius: 6px;
}
.user:hover {
  background-color: var(--Gray-2);
}
/* 头像 */
.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1rem 0 0.5rem;
  width: 2rem;
  height: 2rem;
  color: var(--BG);
  border-radius: 1rem;
  background-color: var(--Theme-6);
}
/* 用户名 */
.username {
  color: var(--Gray-7);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5rem;
}
/* 导航标签 */
.nav > svg {
  color: var(--Gray-7);
  margin-left: 0.5rem;
  margin-right: 1.5rem;
}
.nav {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 11.5rem;
  height: 2rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  cursor: default;
}
.nav:hover {
  background-color: var(--Gray-2);
}
.nav.checked {
  background-color: var(--Theme-1);
}
.nav-name {
  color: var(--Gray-7);
  font-size: 0.75rem;
  line-height: 1.5rem;
  font-weight: 600;
}

.color {
  display: flex;
  flex-direction: column;
  width: 11.5rem;
  margin-top: 1rem;
}
.color-title {
  padding-left: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--Gray-6);
  font-size: 0.75rem;
  line-height: 1.5rem;
}
.color-li,
.add-class {
  display: flex;
  align-items: center;
  height: 2rem;
  margin-bottom: 0.75rem;
  border-radius: 6px;
}
.color-li:hover,
.add-class:hover {
  background-color: var(--Gray-2);
}
.list-class {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin: 0 1.5rem 0 0.5rem;
  border: 2px solid #fee2e2;
  border-radius: 100%;
}
.base-list-class {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 100%;
}
.color-li > span,
.add-class > span {
  color: var(--Gray-7);
  font-size: 0.75rem;
  line-height: 1.5rem;
  font-weight: 600;
}
.add-icon {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  border: 2px solid var(--Gray-2);
  margin: 0 1.5rem 0 0.5rem;
}
.add-icon > span {
  position: relative;
  width: 12px;
  height: 2px;
  background-color: var(--Gray-5);
}

/* 主视区 */
.main {
  margin-left: 15.5rem;
  width: calc(100vw - 15.5rem);
}
/* 头部 */
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 48.5rem;
  height: 6rem;
}
.search {
  width: 19.5rem;
  height: 2.5rem;
  padding: 0 1.5rem;
  border: none;
  color: var(--Gray-4);
  border-radius: 2.5rem;
  background-color: var(--BG);
}
.message {
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 2rem 0 1.5rem;
  border-radius: 2.5rem;
  background-color: var(--BG);
}
</style>
