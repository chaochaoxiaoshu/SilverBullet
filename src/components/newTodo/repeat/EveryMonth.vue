<template>
  <div class="every-month">
    <label for="every-month-day">每月的</label>
    <input
      id="every-month-day"
      type="number"
      :class="{ error: inputSettingIsError }"
      v-model="input.inputMonthDay"
      @input="testingInputType(input.inputMonthDay)"
    />
    <label for="every-month-day">日</label>
    <p v-show="inputSettingIsError == true" id="error">请检查输入格式</p>
  </div>
</template>

<script>
export default {
  name: "EveryMonth",
  computed: {
    input() {
      return this.$store.state.input;
    },
    inputSettingIsError() {
      return this.$store.state.inputSettingIsError;
    },
  },
  methods: {
    testingInputType(input) {
      this.$store.commit('inputSettingIsErrorMethods', 'init');
      let baseInput = input;
      if (input.length == 1) {
        baseInput = "0" + input;
      }
      let day = /^[0][1-9]$|^[1-2][0-9]$|^[3][0-1]$/;
      if (input.length !== 0) {
        if (!day.test(baseInput)) {
        this.$store.commit('inputSettingIsErrorMethods', 'test');
        }
      }
    },
  },
};
</script>

<style scoped>
.every-month {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
input {
  width: 4rem;
  height: 2rem;
  padding: 0.25rem;
  border: 1px solid var(--Gray-4);
  color: var(--Gray-7);
  text-align: right;
  border-radius: 6px;
}
label {
  margin: 0 0.5rem;
  color: var(--Gray-6);
  line-height: 2rem;
}
#error {
  margin-left: 1rem;
  color: #ef4444;
}
input.error {
  border: 1px solid #ef4444;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
} /* chrome */
input[type="number"] {
  -moz-appearance: textfield; /* firefox */
}
</style>