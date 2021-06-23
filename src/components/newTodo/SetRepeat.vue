<template>
  <div class="set-repeat">
    <input
      type="radio"
      class="repeat-radio"
      v-for="(m, index) in repeatModel"
      :key="index"
      :id="m.value"
      :value="m.value"
      v-model="input.checkRepeat"
    />
    <label
      class="label"
      v-for="(m, index) in repeatModel"
      :key="index + 4"
      :for="m.value"
    >
      <div class="radio" :class="{ checked: input.checkRepeat == m.value }"></div>
      {{ m.text }}</label
    >
    <every-week v-if="input.checkRepeat == 'week'" ref="week"></every-week>
    <every-month v-if="input.checkRepeat == 'month'" ref="month"></every-month>
    <every-year v-if="input.checkRepeat == 'year'" ref="year"></every-year>
  </div>
</template>

<script>
import EveryWeek from "../newTodo/repeat/EveryWeek.vue";
import EveryMonth from "../newTodo/repeat/EveryMonth.vue";
import everyYear from "../newTodo/repeat/EveryYear.vue"

export default {
  name: "SetRepeat",
  components: {
    EveryWeek,
    EveryMonth,
    everyYear,
  },
  data() {
    return {
      repeatModel: [
        { value: "day", text: "每天" },
        { value: "week", text: "每周" },
        { value: "month", text: "每月" },
        { value: "year", text: "每年" },
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
.set-repeat {
  display: flex;
  align-items: center;
  margin-top: 2rem;
}
.repeat-radio {
  display: none;
}
.label {
  display: flex;
  align-items: center;
  width: 4.5rem;
  height: 2rem;
  margin-right: 0.5rem;
  color: var(--Gray-6);
  line-height: 2rem;
  cursor: pointer;
}
.radio {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  border-radius: 100%;
  border: 2px solid var(--Theme-2);
}
.radio.checked {
  background-color: var(--Theme-6);
  box-shadow: inset 0 0 0 4px var(--BG);
}
</style>