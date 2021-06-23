<template>
  <div class="app">
    <input
      id="check-setting"
      class="set-check"
      type="checkbox"
      value="timeout"
      v-model="settingIsOpen"
    />
    <label for="check-setting" class="set" @click="$emit('toparent')">
      <svg-icon :icon-class="icon"></svg-icon>
      <p>{{ setting == 'todo'?'设置定时':'设置重复' }}</p>
    </label>
  </div>
</template>

<script>
export default {
  name: 'CheckClass',
  props: ['icon', 'setting', 'isopen'],
  data() {
    return {
      // 设置是否打开
      settingIsOpen: this.isopen,
    }
  },
}
</script>

<style scoped>
/* 设置选项 */
.settings {
  display: flex;
  flex-direction: row;
}
.set {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 6.5rem;
  height: 2rem;
  margin-right: .5rem;
  cursor: pointer;
  border-radius: 6px;
}
.set:hover {
  background-color: var(--Theme-1);
}
.set-check {
  display: none;
}
.set-check:checked + .set {
  box-shadow: 0 0 0 2px var(--Theme-2);
  background-color: var(--Theme-1);
}
.set-check:checked + .set > p {
  color: var(--Gray-7);
}
.set > svg {
  color: var(--Theme-6);
  margin: 0 0.125rem;
}
.set > p {
  margin: 0 0.25rem;
  color: var(--Gray-6);
  font-size: 1rem;
  line-height: 1.5rem;
}
.set-class:hover {
  background: none;
}
</style>