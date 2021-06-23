<template>
  <div
    class="is-complete"
    @click="$emit('ischecked')"
  >
    <div class="bg"></div>
    <svg-icon icon-class="icon-check"></svg-icon>
  </div>
</template>

<script>
export default {
  name: "CheckBox",
}
</script>

<style scoped>
.is-complete {
  position: relative;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  margin: 0 1.5rem 0 2rem;
  border: 2px solid var(--Gray-6);
  border-radius: 1rem;
  color: var(--BG);
  cursor: pointer;
}
.is-complete > svg {
  z-index: 10;
  opacity: 0;
  transform: scale(2);
  transition: 0.2s ease-in-out;
}
.bg {
  position: absolute;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-color: var(--Theme-6);
  transform: scale(0);
  transition: 0.2s ease-in-out;
}
.is-complete.checked > .bg {
  transform: scale(1);
}
.is-complete.checked > svg {
  opacity: 1;
  transform: scale(1);
}
.is-complete:hover {
  border: 2px solid var(--Theme-6);
}
</style>