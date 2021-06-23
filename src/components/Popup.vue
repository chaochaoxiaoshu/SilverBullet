<template>
  <transition name="popup">
    <div class="popup" v-if="isShow">
      <svg-icon :icon-class="visibleIcon"></svg-icon>
      <p class="popupInfo">{{ info }}</p>
      <div class="close" v-if="isShowCloseButton">
        <svg-icon icon-class="icon-close"></svg-icon>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Popup",
  data() {
    return {
      // 弹窗的显示与隐藏
      isShow: false,
      // 图标
      icons: ['icon-success', 'icon-error'],
      visibleIcon: '',
      // 文字信息
      info: '',
      // 是否展示箭头（暂时没有用到这个）
      isShowArrow: false,
      // 是否展示关闭按钮
      isShowCloseButton: false,
      // 获取css
      declaration: document.styleSheets[0].cssRules[0].style,
    }
  },
  methods: {
    // 打开弹窗
    openPopup(type, info, isShowArrow, isShowCloseButton) {
      this.isShow = true;
      this.visibleIcon = this.icons[type];
      this.info = info;
      this.isShowArrow = isShowArrow;
      this.isShowCloseButton = isShowCloseButton;
      setTimeout(this.closePopup, 1000)
    },
    // 关闭弹窗
    closePopup() {
      this.isShow = false;
    }
  }
};
</script>

<style scoped>
:root {
  --Width: 0;
}
.popup-enter-active {
  animation: anim1 0.4s ease-in-out;
}
.popup-leave-active {
  animation: anim2 0.6s;
}
@keyframes anim1 {
  0% {
    top: calc(6rem);
    opacity: 0;
  }
  100% {
    top: calc(8rem);
    opacity: 1;
  }
}
@keyframes anim2 {
  0% {
    top: calc(8rem);
    opacity: 1;
  }
  100% {
    top: calc(10rem);
    opacity: 0;
  }
}
.popup {
  z-index: 200;
  position: absolute;
  display: flex;
  align-items: center;
  top: 8rem;
  left: 50%;
  transform: translate(-50%, 0);
  height: 4rem;
  padding: 0 6rem;
  border-radius: 6px;
  background-color: var(--BG);
  box-shadow: 0 18px 48px 0 rgba(148, 163, 184, 0.3);
}
.svg-icon {
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
}
.popupInfo {
  color: var(--Gray-7);
  font-size: 1rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: 1px;
}
</style>