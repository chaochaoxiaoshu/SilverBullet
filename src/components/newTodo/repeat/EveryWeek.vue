<template>
  <div class="every-week">
    <input
      type="checkbox"
      class="week-input"
      v-for="(d, index) in week"
      :key="index"
      :id="d.value"
      :value="d.value"
      v-model="input.checkRepeatWeek"
    />
    <label
      class="check-week"
      :class="{ checked: input.checkRepeatWeek.includes(d.value) }"
      v-for="(d, index) in week"
      :key="index + 11"
      :for="d.value"
      >{{ d.text }}</label
    >
  </div>
</template>

<script>
export default {
  name: "EveryWeek",
  data() {
    return {
      week: [
        { value: "0", text: "日" },
        { value: "1", text: "一" },
        { value: "2", text: "二" },
        { value: "3", text: "三" },
        { value: "4", text: "四" },
        { value: "5", text: "五" },
        { value: "6", text: "六" },
      ],
    };
  },
  computed: {
    input() {
      return this.$store.state.input;
    },
  },
};
</script>

<style scoped>
.every-week {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
.week-input {
  display: none;
}
.check-week {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  margin-right: .8rem;
  border-radius: 100%;
  border: 1px solid var(--Gray-4);
  color: var(--Gray-6);
  font-size: 0.875rem;
  line-height: 2rem;
  font-weight: 500;
  cursor: pointer;
}
.check-week.checked {
  border: 0;
  background-color: var(--Theme-6);
  color: var(--BG);
}
</style>