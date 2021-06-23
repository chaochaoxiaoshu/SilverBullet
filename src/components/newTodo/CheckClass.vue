<template>
  <div class="set set-class">
    <div class="list-class" :style="{ borderColor: thisClass.secondaryColor }">
      <div class="base-list-class" :style="{ backgroundColor: thisClass.color }"></div>
    </div>
    <p>选择分类</p>
    <div class="class-hover">
      <div
        v-for="(list, index) in classLists"
        :key="index"
        class="list-class"
        :style="{ borderColor: list.secondaryColor }"
        @click="changeThisClass(list)"
      >
        <div
          class="base-list-class"
          :style="{ backgroundColor: list.color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckClass",
  data() {
    return {
      // 所有分类
      classLists: this.$store.state.classLists,
    }
  },
  computed: {
    thisClass() {
      return this.$store.state.input.class;
    }
  },
  methods: {
    // 选中分类
    changeThisClass(list) {
      this.$store.commit('selectClass', list);
    }
  }
};
</script>

<style scoped>
.set {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 2rem;
  margin-right: 1rem;
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

.class-hover {
  z-index: 101;
  position: absolute;
  top: 14rem;
  display: none;
  align-items: center;
  width: auto;
  height: 3rem;
  padding: 0 2rem;
  border-radius: 6px;
  background-color: var(--BG);
  box-shadow: 0 12px 30px 4px rgba(148, 163, 184, 0.3);
  cursor: default;
}
.set-class:hover .class-hover {
  display: flex;
}

.list-class {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin: 0 0.25rem;
  border: 2px solid #fee2e2;
  border-radius: 100%;
}
.base-list-class {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 100%;
  background-color: #ef4444;
}
</style>